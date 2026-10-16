const { exec } = require('child_process');

class GameDetector {
  constructor() {
    this.intervalId = null;
    this.onGameDetectedCallback = null;
    this.lastDetectedProcess = null;
    this.isRunning = false;
  }

  start(profiles = [], onGameDetected) {
    this.onGameDetectedCallback = onGameDetected;
    this.isRunning = true;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Windows PowerShell command to get the foreground window's process executable name
    const psCmd = `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\\"user32.dll\\\")] public static extern IntPtr GetForegroundWindow(); [DllImport(\\\"user32.dll\\\")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId); }'; $h = [Win32]::GetForegroundWindow(); $pid=0; [Win32]::GetWindowThreadProcessId($h, [ref]$pid); if ($pid -gt 0) { (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName + '.exe' }"`;

    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;

      exec(psCmd, { timeout: 1200 }, (err, stdout) => {
        if (err || !stdout) return;
        const currentExe = stdout.trim();
        if (!currentExe || currentExe === this.lastDetectedProcess) return;

        this.lastDetectedProcess = currentExe;

        // Check if currentExe matches any profile
        const matched = profiles.find(p => p.processName.toLowerCase() === currentExe.toLowerCase());
        if (matched && this.onGameDetectedCallback) {
          this.onGameDetectedCallback(matched);
        }
      });
    }, 2000);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

module.exports = new GameDetector();
