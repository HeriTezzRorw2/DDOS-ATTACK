
// ============================================
// 🔥 LOGGER SYSTEM 🔥
// ============================================

const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = process.env.LOG_DIR || './logs';
        this.logFile = path.join(this.logDir, `bot_${Date.now()}.log`);
        
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMsg = `[${timestamp}] ${message}`;
        
        console.log(logMsg);
        
        if (process.env.SAVE_LOGS === 'true') {
            fs.appendFileSync(this.logFile, logMsg + '\n');
        }
    }

    getLastLogs(lines = 10) {
        try {
            if (fs.existsSync(this.logFile)) {
                const data = fs.readFileSync(this.logFile, 'utf8');
                const logs = data.split('\n').filter(l => l).slice(-lines);
                return logs.join('\n');
            }
        } catch (err) {
            return 'Error reading logs';
        }
        return 'No logs found';
    }
}

module.exports = Logger;
