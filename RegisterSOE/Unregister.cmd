@SETLOCAL
@SET PATH=%PATH%;%programfiles(x86)%\Common Files\ArcGIS\bin
ESRIRegAsm.exe LayerMetadata.dll /p:server /e /u
@ENDLOCAL