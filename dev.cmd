@echo off
rem 本机 Node 未加入系统 PATH，这里临时指向 fnm 安装的 Node 22
set "PATH=%APPDATA%\fnm\node-versions\v22.23.2\installation;%PATH%"
cd /d "%~dp0"
echo Oura Worker local dev: http://localhost:8787
npm run dev
