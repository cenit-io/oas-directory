import LZString from 'lz-string';

class Session {
  get currentAccount() {
    return this.get('account');
  }

  get isAuthenticate() {
    return !!this.currentAccount;
  }

  get serverBaseUrl() {
    return process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'https://server.cenit.io/api/v3';
  }

  get appBaseUrl() {
    return window.location.href.replace(/\?.*$/, '').replace(/\/$/, '');
  }

  get iFrameDetected() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('embedded') || (window !== window.parent);
  }

  get(key, defaultValue) {
    const item = window.sessionStorage.getItem(LZString.compress(key));

    return (item === null) ? defaultValue : JSON.parse(LZString.decompress(item));
  }

  set(key, value) {
    try {
      window.sessionStorage.setItem(LZString.compress(key), LZString.compress(JSON.stringify(value)));
    } catch (e) {
      window.sessionStorage.clear();
    }
  }

  del(key) {
    window.sessionStorage.removeItem(LZString.compress(key));
  }

  clear() {
    window.sessionStorage.clear();
  }
}

const session = new Session();

export default session;
