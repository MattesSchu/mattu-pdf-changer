@echo OFF

magick -density 120 -quality 75 -compress jpeg .\in.pdf ..\frontend\out.pdf
