# UD Block: Accordion

Interaktiver Akkordeon-Block für den WordPress-Block-Editor.  
Er ermöglicht ein- und ausklappbare Inhalte mit editierbarem Titel und optional geöffneter Startansicht.

## Funktionen
- Ein- und ausklappbare Bereiche mit sanfter Animation  
- Editierbarer Titel (`title`) und Option „initiallyOpen“  
- Auswahl erlaubter Blöcke über Plugin-Einstellungen  
- Getrennte Editor- und Frontend-Skripte für Performance  
- Voll kompatibel mit Full Site Editing (FSE)

## Installation
Das Plugin in WordPress hochladen und aktivieren.

## Struktur
```
includes/       # Block-Registrierung, Enqueue, Einstellungen
src/js/         # edit.js, save.js, frontend.js
src/css/        # editor.scss, frontend.scss
build/          # Kompilierte Dateien
block.json      # Block-Metadaten
ud-accordion-block.php
```

## Lizenz
GPL v2 or later  
© ulrich.digital gmbh – https://ulrich.digital

<!--
Interne Verwendung:
Eingesetzt in den Projekten illgau.ch, schule.illgau.ch und bbzg.ch
-->
