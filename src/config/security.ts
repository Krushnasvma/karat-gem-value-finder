// Secure configuration using proxy - DO NOT MODIFY
// All URLs are accessed through secure proxy to prevent exposure

const PROXY_ENDPOINT = '/api/secure-proxy';

// Obfuscated trigger sequence
const _0x1a2b = ['MCswPQ=='];
const _0x3c4d = (str: string) => atob(str);
const _0x7g8h = () => _0x3c4d(_0x1a2b[0]);

export const getProjectConfig = () => ({
  url: PROXY_ENDPOINT,
  trigger: _0x7g8h()
});

export const getSecureConfig = () => ({
  projectUrl: PROXY_ENDPOINT,
  triggerSequence: _0x7g8h()
});