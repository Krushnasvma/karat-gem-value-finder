// Obfuscated configuration - DO NOT MODIFY
<<<<<<< HEAD
const _0x1a2b = ['aHR0cDovL2xvY2FsaG9zdDo1MTcz', 'MCswPQ=='];
=======
const _0x1a2b = ['aHR0cHM6Ly9zdnZocXAwbC01MTczLmluYzEuZGV2dHVubmVscy5tcy8=', 'aHR0cHM6Ly9zdnZocXAwbC01MDAwLmluYzEuZGV2dHVubmVscy5tcy8='];
>>>>>>> 3432a0cc543ebdf13c7fa6d208f3d28e59f4e84b
const _0x3c4d = (str: string) => atob(str);
const _0x5e6f = () => _0x3c4d(_0x1a2b[0]);
const _0x7g8h = () => _0x3c4d(_0x1a2b[1]);

export const getProjectConfig = () => ({
  url: _0x5e6f(),
  trigger: _0x7g8h()
});

// Additional obfuscation layer
const _0x9i0j = new Map();
_0x9i0j.set('k1', _0x5e6f);
_0x9i0j.set('k2', _0x7g8h);

export const getSecureConfig = () => ({
  projectUrl: _0x9i0j.get('k1')?.(),
  triggerSequence: _0x9i0j.get('k2')?.()
});