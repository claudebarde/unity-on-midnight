type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  component?: string;
  data?: any;
}

class Logger {
  private static formatAddress(address: string): string {
    if (!address) return '';
    // Split the address at the | character
    const [part1, part2] = address.split('|');
    if (!part2) return `${part1.slice(0, 6)}...${part1.slice(-4)}`;
    
    // Format both parts
    return `${part1.slice(0, 6)}...${part1.slice(-4)}|${part2.slice(0, 6)}...${part2.slice(-4)}`;
  }

  private static getEmoji(level: LogLevel): string {
    switch (level) {
      case 'info': return '🔵';
      case 'warn': return '🟡';
      case 'error': return '🔴';
      case 'debug': return '🟣';
      default: return '⚪';
    }
  }

  private static formatMessage(message: string, options: LogOptions = {}): string {
    const timestamp = new Date().toISOString();
    const emoji = this.getEmoji(options.level || 'info');
    const component = options.component ? `[${options.component}]` : '';
    return `${emoji} ${timestamp} ${component} ${message}`;
  }

  static log(message: string, options: LogOptions = {}) {
    const formattedMessage = this.formatMessage(message, options);
    
    switch (options.level) {
      case 'warn':
        console.warn(formattedMessage, options.data || '');
        break;
      case 'error':
        console.error(formattedMessage, options.data || '');
        break;
      case 'debug':
        console.debug(formattedMessage, options.data || '');
        break;
      default:
        console.log(formattedMessage, options.data || '');
    }
  }

  static wallet = {
    connecting: () => {
      this.log('Initiating wallet connection...', {
        component: 'Wallet'
      });
    },
    
    connected: (data: any) => {
      this.log('Wallet connected successfully', {
        component: 'Wallet',
        data
      });
    },
    
    disconnecting: () => {
      this.log('Initiating wallet disconnect...', {
        component: 'Wallet'
      });
    },
    
    disconnected: () => {
      this.log('Wallet disconnected successfully', {
        component: 'Wallet'
      });
    },
    
    error: (context: string, data: any) => {
      this.log(`Wallet error: ${context}`, {
        level: 'error',
        component: 'Wallet',
        data
      });
    },
    
    stateChange: (state: any) => {
      this.log('Wallet state changed', {
        level: 'debug',
        component: 'Wallet',
        data: state
      });
    }
  };
}

export default Logger;
