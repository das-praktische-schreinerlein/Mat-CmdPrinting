rem <h4>FeatureDomain:</h4>
rem     BrowserPlugin Publishing
rem <h4>FeatureDescription:</h4>
rem     test matcmdprinting-package
rem <h4>Example:</h4>
rem     install: firefox matcmdprinting.xpi
rem     run: firefox -printurl "http://michas-ausflugstipps.de/urlaube.php" -printmode pdf -printdelay 5 -printfile test.pdf
rem 
rem @author Michael Schreiner <ich@michas-ausflugstipps.de>
rem @category BrowserPlugin
rem @copyright Copyright (c) 2005, Michael Schreiner
rem @license http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0


rem set mypath
set BASEPATH=%~dp0

rem init config
call %BASEPATH%\..\config\config.bat

call %FFCMD% -printurl "http://www.michas-ausflugstipps.de/urlaube.php?ASBOOKVERSION=1" -printmode pdf -printdelay 5 -printfile %BASEPATH%\..\tests\test1.pdf
sleep 10
call %FFCMD% -printurl "http://www.michas-ausflugstipps.de/show_tour.php?T_ID=2689&ASBOOKVERSION=1" -printmode pdf -printdelay 5 -printfile %BASEPATH%\..\tests\test2.pdf
sleep 10
call %FFCMD% -printurl "http://www.michas-ausflugstipps.de/show_tour.php?T_ID=2632&ASBOOKVERSION=1" -printmode pdf -printdelay 5 -printfile %BASEPATH%\..\tests\test3.pdf
sleep 10
