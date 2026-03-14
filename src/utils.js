
// ============================================
// 🔥 UTILITY FUNCTIONS - ALAT BANTU 🔥
// ============================================

class Utils {
    // GENERATE RANDOM IP
    static randomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    // GENERATE RANDOM STRING
    static randomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // GENERATE RANDOM NUMBER
    static randomNumber(min = 0, max = 1000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // FORMAT BYTES
    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // FORMAT TIME
    static formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        const hStr = h > 0 ? `${h}h ` : '';
        const mStr = m > 0 ? `${m}m ` : '';
        const sStr = `${s}s`;
        
        return hStr + mStr + sStr;
    }

    // SLEEP
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // PARSE URL
    static parseUrl(url) {
        try {
            return new URL(url);
        } catch (err) {
            return null;
        }
    }

    // VALIDATE URL
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    }

    // GET DOMAIN FROM URL
    static getDomain(url) {
        try {
            const parsed = new URL(url);
            return parsed.hostname;
        } catch (err) {
            return null;
        }
    }

    // GET RANDOM USER AGENT
    static randomUA() {
        const uas = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        return uas[Math.floor(Math.random() * uas.length)];
    }

    // GET RANDOM REFERER
    static randomReferer() {
        const referers = [
            'https://www.google.com/',
            'https://www.bing.com/',
            'https://www.facebook.com/',
            'https://twitter.com/',
            'https://www.instagram.com/',
            'https://www.youtube.com/',
            'https://www.tiktok.com/'
        ];
        return referers[Math.floor(Math.random() * referers.length)];
    }

    // GET CURRENT TIMESTAMP
    static timestamp() {
        return Math.floor(Date.now() / 1000);
    }

    // GET CURRENT DATE STRING
    static dateString() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    }

    // PARSE PROXY STRING
    static parseProxy(proxyStr) {
        const parts = proxyStr.split(':');
        if (parts.length === 2) {
            return {
                host: parts[0],
                port: parseInt(parts[1]),
                protocol: 'http'
            };
        } else if (parts.length === 3) {
            return {
                host: parts[0],
                port: parseInt(parts[1]),
                protocol: parts[2]
            };
        }
        return null;
    }

    // ENCODE PROXY TO STRING
    static encodeProxy(proxy) {
        return `${proxy.host}:${proxy.port}`;
    }

    // CHUNK ARRAY
    static chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    // DEDUPLICATE ARRAY
    static deduplicate(array) {
        return [...new Set(array)];
    }

    // COUNT OCCURRENCES IN ARRAY
    static countOccurrences(array, value) {
        return array.filter(item => item === value).length;
    }
}

module.exports = Utils;
