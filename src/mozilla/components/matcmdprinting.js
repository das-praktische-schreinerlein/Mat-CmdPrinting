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
 *     cmdhandler and initialisation
 */


/**
 * ###############################
 * # vars
 * ###############################
 */
const Cc = Components.classes;
const Ci = Components.interfaces;
const CHROME_URI = "chrome://matcmdprinting/content/mininav.xul";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");


/**
 * ###############################
 * # utility functions
 * ###############################
 */
function openPrintWindow(aParent, aURL, aTarget, aFeatures, aArgs) {

    // convert js-args to chrome-args
    var args = Components.classes["@mozilla.org/supports-array;1"]
               .createInstance(Components.interfaces.nsICollection);
    while (aArgs && aArgs.length > 0) {
        var arg = aArgs.shift();
        var argstring = Components.classes["@mozilla.org/supports-string;1"]
                        .createInstance(Components.interfaces.nsISupportsString);
        argstring.data = arg? arg : "";
        args.AppendElement(argstring);
    }
    
    // create chromewindow
    var wnd = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                             .getService(Components.interfaces.nsIWindowWatcher)
                             .openWindow(aParent, aURL, aTarget, aFeatures, args);
    return wnd;
}


function resolvePathInternal(aCmdLine, aArgument) {
    var file = null;

    if (aArgument)
        file = aCmdLine.resolveFile(aArgument);

    return (file)? file.path : null;
}

function resolveModeInternal(aArgument) {
    var mode = -1;

    if (aArgument) {
        aArgument = aArgument.toString().toLowerCase();
        switch (aArgument) {
        case "1":
        case "pdf":
            mode = 1;
            break;
        case "2":
        case "png":
            mode = 2;
            break;
        case "3":
        case "ps":
        case "postscript":
            mode = 3;
            break;
        case "0":
        case "printer":
            mode = 0;
            break;
        default:
            mode = -1;
        }
    }
    return mode;
}



/**
 * ###############################
 * # Command Line Handler
 * ###############################
 */
function CommandLineHandler() {
};

CommandLineHandler.prototype = {
    classDescription: "matcmdprintingHandler",
    // CHANGEME: generate a unique ID
    classID: Components.ID('{2991c315-b871-42cd-b33f-bfee4fcbf683}'),
    // CHANGEME: change the type in the contractID to be unique to your application
    contractID: "@mozilla.org/commandlinehandler/general-startup;1?type=matcmdprinting",
    _xpcom_categories: [{
        category: "command-line-handler",
        // category names are sorted alphabetically. Typical command-line handlers use a
        // category that begins with the letter "m".
        entry: "m-matcmdprinting"
    }],

    QueryInterface: XPCOMUtils.generateQI(
        [Ci.nsICommandLineHandler]),
        /* nsICommandLineHandler */
        handle : function clh_handle(cmdLine) {
            try {
                // extract and check parameters
                var uristr = cmdLine.handleFlagWithParam("printurl", false);
                if (uristr) {
                    // convert uristr to an nsIURI
                    var uri = cmdLine.resolveURI(uristr);
    
                    param = cmdLine.handleFlagWithParam("printmode", false);
                    var mode = resolveModeInternal(param);
    
                    param = cmdLine.handleFlagWithParam("printfile", false);
                    var path = resolvePathInternal(cmdLine, param);
    
                    param = cmdLine.handleFlagWithParam("printdelay", false);
                    var delay = 0;
                    if (param && !isNaN(param))
                        delay = parseInt(param).toString();
    
                    param = cmdLine.handleFlagWithParam("printprinter", false);
                    var printer = param;
                    openPrintWindow(null, CHROME_URI, "_blank", "chrome,dialog=no,all",
                            [uri.spec, mode.toString(), path, delay, printer]);
                    cmdLine.preventDefault = true;
                }
            }
            catch (e) {
                Components.utils.reportError("incorrect parameter passed to -printurl on the command line." + e);
            }
        },
        helpInfo : "  -printurl  <uri>     print URI to PDF\n" +
                   "  -printmode <uri>     Modus png,pdf\n"
};

var NSGetFactory = XPCOMUtils.generateNSGetFactory([CommandLineHandler]);