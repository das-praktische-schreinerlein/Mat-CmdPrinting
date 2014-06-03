rem <h4>FeatureDomain:</h4>
rem     BrowserPlugin Publishing
rem <h4>FeatureDescription:</h4>
rem     generate and install matcmdprinting-package
rem <h4>Example:</h4>
rem     install: firefox target\matcmdprinting.xpi
rem     run: firefox -printurl "http://michas-ausflugstipps.de/urlaube.php" -printmode pdf -printdelay 5 -printfile test.pdf
rem 
rem @author Michael Schreiner <ich@michas-ausflugstipps.de>
rem @category BrowserPlugin
rem @copyright Copyright (c) 2005, Michael Schreiner
rem @license http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0


rem set mypath
set SCRIPTBASEPATH=%~dp0

rem init config
call %SCRIPTBASEPATH%\..\config\config.bat

rem set basename
set BASENAME=matcmdprinting
set ZIPNAME=%SCRIPTBASEPATH%\..\target\%BASENAME%.zip
set XPINAME=%SCRIPTBASEPATH%\..\target\%BASENAME%.xpi


rem clear old packages
del %ZIPNAME%
del %XPINAME%

rem zip package
%ZIPCMD% %ZIPNAME% %SCRIPTBASEPATH%\..\src\mozilla\*
move %ZIPNAME% %XPINAME%

rem install package
%FFCMD% %XPINAME%