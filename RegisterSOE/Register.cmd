@SETLOCAL
@SET PATH=%PATH%;%programfiles(x86)%\Common Files\ArcGIS\bin
ESRIRegAsm.exe LayerMetadataSoe.dll /p:server /e
@ENDLOCAL