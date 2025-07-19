const { build } = require('electron-builder');
const path = require('path');

const buildDesktop = async () => {
  try {
    console.log('Building desktop applications...');
    
    const config = {
      appId: 'com.krushna.calculator-pro',
      productName: 'Gold Calculator Pro',
      directories: {
        output: 'dist-desktop'
      },
      files: [
        'dist/**/*',
        'electron.config.js',
        'preload.js'
      ],
      extraFiles: [
        {
          from: 'src/assets',
          to: 'assets'
        }
      ],
      win: {
        target: [
          {
            target: 'nsis',
            arch: ['x64', 'ia32']
          },
          {
            target: 'portable',
            arch: ['x64', 'ia32']
          }
        ],
        icon: 'src/assets/icon.ico',
        requestedExecutionLevel: 'asInvoker'
      },
      mac: {
        target: [
          {
            target: 'dmg',
            arch: ['x64', 'arm64']
          },
          {
            target: 'zip',
            arch: ['x64', 'arm64']
          }
        ],
        icon: 'src/assets/icon.icns',
        category: 'public.app-category.productivity'
      },
      linux: {
        target: [
          {
            target: 'AppImage',
            arch: ['x64', 'arm64']
          },
          {
            target: 'deb',
            arch: ['x64', 'arm64']
          },
          {
            target: 'rpm',
            arch: ['x64', 'arm64']
          }
        ],
        icon: 'src/assets/icon.png',
        category: 'Office'
      },
      nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true
      },
      publish: null // Disable auto-publishing
    };

    await build({
      config,
      x64: true,
      ia32: true,
      arm64: true,
      publish: 'never'
    });

    console.log('Desktop build completed successfully!');
    console.log('✅ Windows: NSIS installer and portable executable');
    console.log('✅ macOS: DMG and ZIP packages');
    console.log('✅ Linux: AppImage, DEB, and RPM packages');
    
  } catch (error) {
    console.error('Desktop build failed:', error);
    process.exit(1);
  }
};

buildDesktop();