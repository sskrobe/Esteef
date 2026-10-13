@echo off
rem Runs sync-local.ps1 from Command Prompt. Usage: sync-local "C:\path\to\your\vault"  (vault path is optional)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync-local.ps1" -Vault "%~1"
