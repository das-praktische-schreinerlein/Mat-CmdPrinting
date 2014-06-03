mat-cmdprinting plugin for firefox
=====================

# Desc
A firefox-plugin that prints Urls to PDF direct from the commandline.
It is customized for printing www.michas-ausflugstipps.de.

Bases on cmdprinting from from O. Atsushi https://sites.google.com/site/torisugari/commandlineprint2 
whose module was broken since firefox 4.X. Many Thanks to him for the idea and some of the code.

# TODO for me
- [ ] use and optimize it :-)
- [ ] if plugin is activated sometimes firefox has layoutproblems

# History and milestones
- 2014 
   - prepared the tools for going public (documentation...) 
   - separated the public-tools
- 2011
   - initial version for www.michas-ausflugstipps.de/portal-bucherstellung.html

# Requires
- for building
   - zip
- for use
   - firefox > 4.0

# Install
- save the project to 
```bat
d:\public_projects\matcmdprinting
```

- configure the project
```bat
d:\public_projects\matcmdprinting\config\config.bat
```

- import project to Eclipse

- run installer 
```bat
cd d:\public_projects\matcmdprinting
install\install.bat
```

# Example
- change  
   - tests/test.bat

- run  
```bat
cd d:\public_projects\matcmdprinting
tests\test.bat
```


# License
```
/**
 * @author Michael Schreiner <ich@michas-ausflugstipps.de>
 * @author Inspired by cmdprinting from from O. Atsushi torisugari@gmail.com whose module was broken since firefox 2.X. Many Thanks to him for the idea and some of the code.
 * @category publishing
 * @copyright Copyright (c) 2011-2014, Michael Schreiner
 * @license http://mozilla.org/MPL/2.0/ Mozilla Public License 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
```
