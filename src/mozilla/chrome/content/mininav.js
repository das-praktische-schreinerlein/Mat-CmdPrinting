/**
 * <h4>FeatureDomain:</h4>
 *     publishing
 *
 * <h4>FeatureDescription:</h4>
 *     software for printing urls to pdf
 * 
 * @author Michael Schreiner <ich@michas-ausflugstipps.de>
 * @author Bases on cmdprinting from from O. Atsushi https://sites.google.com/site/torisugari/commandlineprint2 whose module was broken since firefox 4.X. Many Thanks to him for the idea and some of the code.
 * @category publishing
 * @copyright Copyright (c) 2012-2014, Michael Schreiner
 * @license http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * <h4>FeatureDomain:</h4>
 *     Tools - Browser-Plugins
 * <h4>FeatureDescription:</h4>
 *     printer-logic
 */

/**
 * ###############################
 * # handler + vars
 * ###############################
 */

// accept only one printevent 
var globalLocked = false;

// configure PrintProgressListener (shutdown browserwindow after print)
var globalPrintProgressListener = {
    onStateChange : function (aWebProgress,
            aRequest,
            aStateFlags,
            aStatus) {
        delayedShutdown();
    },

    onProgressChange : 
        function (aWebProgress,
                aRequest,
                aCurSelfProgress,
                aMaxSelfProgress,
                aCurTotalProgress,
                aMaxTotalProgress) {
    }
    ,
    onLocationChange : 
        function (aWebProgress,
                aRequest,
                aLocation){
    }
    ,
    onStatusChange : 
        function (aWebProgress,
                aRequest,
                aStatus,
                aMessage){
    }
    ,
    onSecurityChange : 
        function (aWebProgress,
                aRequest,
                aState){
    }
    ,
    /* nsISupports */
    QueryInterface : 
        function progress_qi(aIID) {
        if (!aIID.equals(Components.interfaces.nsISupports) &&
                !aIID.equals(Components.interfaces.nsIWebProgressListener))
            throw Components.results.NS_ERROR_NO_INTERFACE;
        return this;
    }
};

/**
 * ###############################
 * # print-logic
 * ###############################
 */
function startup() {
    // check parameters and vars
    var uri = (window.arguments)? window.arguments[0] : null;
    if (! uri) {
        alert("Exception message: no uri!");
        pageShutdown();
    }

    // add eventlistener: if pageshow do print
    getBrowser().addEventListener("pageshow", 
        function() { 
            onPageShow(); 
        }, 
        false);

    // try to load uri
    try {
        getBrowser().loadURI(uri);
    } catch (e) {
        alert("Exception loading:" + uri + " Exception:" + e.message);
    }
}

function pageShutdown() {
    window.close();
}

function delayedShutdown() {
    window.setTimeout(window.close, 1000);
}

/**
 * pageShow-Handler: call doPrintPage when page is ready
 */
function onPageShow() {
    var delay = getDelay();

    // if delay: wait delay till call doPrintPage
    if (delay > 0) {
        setTimeout(doPrintPage, delay * 1000);
    } else {
        doPrintPage();
    }
}

/**
 * print the current browser-page
 */
function doPrintPage() {
    if (globalLocked)
        return;
    else
        globalLocked = true;

    // init print settings
    var browser = getBrowser();    
    var browser_xul = browser.QueryInterface(Components.interfaces.nsIDOMXULElement);
    var browser_box_object = browser_xul.boxObject.QueryInterface(Components.interfaces.nsIBrowserBoxObject);
    var content_viewer = browser_box_object.docShell.QueryInterface(Components.interfaces.nsIDocShell).contentViewer;
    var webbrowser_print = content_viewer.QueryInterface(Components.interfaces.nsIWebBrowserPrint);

    // initprint settings
    var printsettings_service = Components.classes["@mozilla.org/gfx/printsettings-service;1"].getService(Components.interfaces.nsIPrintSettingsService);
    var printsettings = printsettings_service.newPrintSettings;

    // load printersettings from default-printer
    var printerName = printsettings_service.defaultPrinterName;
    var printsettings_default = printsettings_service.newPrintSettings;
    printsettings_service.initPrintSettingsFromPrinter(printerName, printsettings_default);

    // init printesstings
    initPrintSettings(printsettings);
    
    // start print with configured printprogessListener
    try {
        webbrowser_print.print(printsettings, globalPrintProgressListener);
    } catch (err) {
        var url = (window.arguments)? window.arguments[0] : "";
        alert("Exception loading:" + url + " Exception:" + err.message);
    }
}

/**
 * ###############################
 * # init prinsettings
 * ###############################
 */
function initPrintSettings(printsettings) {
    initPrintSesstingsPrintProcess(printsettings);
    initPrintSettingsCanvasLayout(printsettings);
    initPrintSettingsOutput(printsettings);
    initPrintSettingsPrintInfos(printsettings);
    initPrintSettingsPrintLayout(printsettings);
}

function initPrintSettingsOutput(printsettings) {
    // print to file
    printsettings.printToFile = true;
    var mode = getPrintMode();
    if (mode == 1) {
        printsettings.outputFormat = 
            Components.interfaces.nsIPrintSettings.kOutputFormatPDF;
    } else {
        printsettings.outputFormat = 
            Components.interfaces.nsIPrintSettings.kOutputFormatPS;
    } 
    printsettings.toFileName = getOutputFilePath(mode);

    // copies
    printsettings.numCopies = 1;
}

function initPrintSettingsCanvasLayout(printsettings) {
    // print colors/images...
    printsettings.printBGColors = true;
    printsettings.printBGImages = true;
    printsettings.printInColor = true;
}

function initPrintSettingsPrintLayout(printsettings) {
    // papertype
    // Follow application specific properties and methods
    // PD = paperData -> see Windows Paper Sizes http://msdn.microsoft.com/en-us/library/dd319099%28v=vs.85%29.aspx 
    // PN = paperName -> Linux(Unix) paperName see http://library.gnome.org/devel/gtk/2.21/gtk-GtkPaperSize.html
    // PWG = Printing WorkGroup for Media Standartizied Names ftp://ftp.pwg.org/pub/pwg/candidates/cs-pwgmsn10-20020226-5101.1.pdf
    //       Is is almost same as PN, but at now is not used. It is implemented for future use
    // Name = Human readable Name
    // M = Measure for Width and Heidth can be kPaperSizeInches or kPaperSizeMillimeters 
    // W = Width of paper in M   
    // H = Height of paper in M   
    //  paperSizeList : {
    //      1 : {PD: 1, PN: 'na_letter',   PWG: 'na_letter_8.5x11in',       Name: 'US Letter', W: 8.5 , H: 11, M: kPaperSizeInches}
    //    , 2 : {PD: 2, PN: 'na_letter',   PWG: 'na_letter_8.5x11in',       Name: 'US Letter Small', W: 8.5 , H: 11, M: kPaperSizeInches} // pdf creator reports paper_data = 119!
    //    , 3 : {PD: 3, PN: 'ppd_Tabloid', PWG: 'na_ledger_11x17in',        Name: 'US Tabloid', W: 11 , H: 17, M: kPaperSizeInches}
    //    , 4 : {PD: 4, PN: 'ppd_Ledger',   PWG: '', /*???*/                 Name: 'US Ledger', W: 17 , H: 11, M: kPaperSizeInches}
    //    , 5 : {PD: 5, PN: 'na_legal',    PWG: 'na_legal_8.5x14in',        Name: 'US Legal', W: 8.5 , H: 14, M: kPaperSizeInches}
    //    , 6 : {PD: 6, PN: 'na_invoice',  PWG: 'na_invoice_5.5x8.5in',     Name: 'US Statement', W: 5.5 , H: 8.5, M: kPaperSizeInches}   // Half Letter
    //    , 7 : {PD: 7, PN: 'na_executive',PWG: 'na_executive_7.25x10.5in', Name: 'US Executive', W: 7.25 , H: 10.5, M: kPaperSizeInches}
    //    , 8 : {PD: 8, PN: 'iso_a3',      PWG: 'iso_a3_297x420mm',         Name: 'A3', W: 297 , H: 420, M: kPaperSizeMillimeters}
    //    , 9 : {PD: 9, PN: 'iso_a4',      PWG: 'iso_a4_210x297mm',         Name: 'A4', W: 210 , H: 297, M: kPaperSizeMillimeters}
    //    ,10 : {PD:10, PN: 'iso_a4',      PWG: 'iso_a4_210x297mm',         Name: 'A4 Small', W: 210 , H: 297, M: kPaperSizeMillimeters}
    //    ,11 : {PD:11, PN: 'iso_a5',      PWG: 'iso_a5_148x210mm',         Name: 'A5', W: 148 , H: 210, M: kPaperSizeMillimeters}

    // set printpane
    //  printsettings.marginTop = 0;
    //  printsettings.marginLeft = 0;
    //  printsettings.marginRight = 0;
    //  printsettings.marginBottom = 0;
  
    // special settings for Bools of michas.auslfugstipps.de
    printsettings.scaling = 1.10; 
    printsettings.shrinkToFit = false;

    printsettings.paperName = "iso_a4";
    printsettings.paperData = 9; // printsettings_default.paperData
    //    printsettings.paperSizeType = Components.interfaces.nsIPrintSettings.kPaperSizeMillimeters;  // printsettings.paperSizeType
    printsettings.paperHeight = 11.69291; // "297"
    printsettings.paperWidth = 8.26772; //"210";
    //    printsettings.printRange = "";
    //    printsettings.startPageRange = "";
    //    printsettings.endPageRange = "";

    // Format
    printsettings.orientation = Components.interfaces.nsIPrintSettings.kPortraitOrientation;
    //        printsettings.orientation = Components.interfaces.nsIPrintSettings.kLandscapeOrientation;
}

function initPrintSettingsPrintInfos(printsettings) {
    // Header/Footer-Strings
    printsettings.title = "";
    printsettings.headerStrCenter = "";
    printsettings.headerStrLeft = "";
    printsettings.headerStrRight = "";
    printsettings.footerStrCenter = "";
    printsettings.footerStrLeft = "";
    printsettings.footerStrRight = "";

    // Format
    printsettings.orientation = Components.interfaces.nsIPrintSettings.kPortraitOrientation;
    //        printsettings.orientation = Components.interfaces.nsIPrintSettings.kLandscapeOrientation;
}
function initPrintSesstingsPrintProcess(printsettings) {
    // do it silent
    printsettings.printSilent = true;
    printsettings.showPrintProgress = false;
}

/**
 * ###############################
 * # getter+setter
 * ###############################
 */
function getOutputFilePath(aMode) {
    var path = (window.arguments && window.arguments[2])? window.arguments[2] : "";
    if (path)
        return path;
    
    path = "test.pdf";
}

function getPrintMode() {
    var mode = (window.arguments && window.arguments[1]) ? 
                    parseInt(window.arguments[1]) : 0;

    if (mode < 0) {
        mode = 0;
    }

    return mode;
}

function getDelay() {
    var delay = 0;
    if (window.arguments && window.arguments[3]) {
        delay = parseInt(window.arguments[3]);
        if (delay < 0)
            delay = 0;
        if (delay > 120)
            delay = 120;
    }

    return delay;
}

function getBrowser() {
    return document.getElementById("content");
}