@echo OFF
echo uuid: %1
echo fileName: %2

gswin64c ^
        -sDEVICE=pdfwrite ^
        -dCompatibilityLevel=1.4 ^
        -dPDFSETTINGS=/default ^
        -dNOPAUSE ^
        -dQUIET ^
        -dBATCH ^
        -dDetectDuplicateImages ^
        -dCompressFonts=true ^
        -r150 ^
        -sOutputFile="./temp/%1/c-%2" ^
        "./temp/%1/%2"
