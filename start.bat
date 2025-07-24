@echo off
echo Plastic Surgery Triage System Launcher
echo =====================================
echo.

echo Checking if Ollama is installed...
where /q ollama
if %ERRORLEVEL% NEQ 0 (
    echo Ollama is not installed or not in PATH.
    echo Please install Ollama from https://ollama.ai/ to use the AI chat assistant.
    echo.
    echo Press any key to continue without AI chat functionality...
    pause > nul
) else (
    echo Ollama is installed.
    echo.
    echo NOTE: To use the AI assistant, make sure to start Ollama in a separate terminal:
    echo.
    echo    ollama serve
    echo.
    echo And pull the LLama3 model if you haven't already:
    echo.
    echo    ollama pull llama3
    echo.
)

echo Starting the Plastic Surgery Triage System...
echo The application will open in your default browser.
echo.
echo Press Ctrl+C to stop the application.
echo.

npm start
