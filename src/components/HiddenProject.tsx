// import { useState, useEffect } from 'react';
// import { ArrowLeft } from 'lucide-react';

// interface HiddenProjectProps {
//   onBack: () => void;
//   projectUrl: string;
// }

// export const HiddenProject = ({ onBack, projectUrl }: HiddenProjectProps) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Check connection and handle errors
//     const timer = setTimeout(() => {
//       if (!navigator.onLine) {
//         setError('No internet connection');
//       } else {
//         setIsLoading(false);
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     // Disable right-click context menu
//     const handleContextMenu = (e: MouseEvent) => {
//       e.preventDefault();
//     };

//     document.addEventListener('contextmenu', handleContextMenu);
    
//     return () => {
//       document.removeEventListener('contextmenu', handleContextMenu);
//     };
//   }, []);

//   const handleBack = () => {
//     // Clear any stored data/tokens
//     localStorage.clear();
//     sessionStorage.clear();
    
//     // Clear cache if possible
//     if ('caches' in window) {
//       caches.keys().then(names => {
//         names.forEach(name => {
//           caches.delete(name);
//         });
//       });
//     }
    
//     onBack();
//   };

//   if (error) {
//     // Don't render error page - errors should be shown on calculator display
//     handleBack();
//     return null;
//   }

//   return (
//     <div className="hidden-portal">
//       {/* Compact Professional Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
//         <div className="flex items-center justify-between px-3 py-2 h-10">
//           <button
//             onClick={handleBack}
//             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
//             title="Back to Calculator"
//           >
//             <ArrowLeft size={16} />
//             <span>Back</span>
//           </button>
//           <div className="text-xs text-muted-foreground font-medium tracking-wide">@Developed by Krushna Soni</div>
//         </div>
//       </nav>

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex items-center justify-center h-screen pt-10">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
//             <div className="text-sm text-muted-foreground">Loading...</div>
//           </div>
//         </div>
//       )}

//       {/* Project iframe */}
//       {!isLoading && !error && (
//         <iframe
//           src={projectUrl}
//           className="w-full border-0"
//           style={{ 
//             height: 'calc(100vh - 2.5rem)',
//             marginTop: '2.5rem',
//             background: 'transparent',
//             display: 'block'
//           }}
//           title="Hidden Project"
//           sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
//           loading="lazy"
//           onLoad={(e) => {
//             const iframe = e.currentTarget;
//             try {
//               // Check if iframe loaded successfully by checking its content
//               const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
//               if (iframeDoc?.title.includes('404') || 
//                   iframeDoc?.title.includes('Not Found') ||
//                   iframeDoc?.body?.innerText?.includes('deployment cannot be found') ||
//                   iframeDoc?.body?.innerText?.includes('404')) {
//                 setError('Project not found');
//                 return;
//               }
//             } catch (e) {
//               // Cross-origin iframe - assume it loaded if no error
//             }
//             setIsLoading(false);
//           }}
//           onError={() => setError('Failed to load project')}
//         />
//       )}
//     </div>
//   );
// };




// import { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Shield, Lock, Eye, EyeOff } from 'lucide-react';

// interface HiddenProjectProps {
//   onBack: () => void;
//   projectUrl: string;
// }

// export const HiddenProject = ({ onBack, projectUrl }: HiddenProjectProps) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isSecureMode, setIsSecureMode] = useState(false);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [iframeContent, setIframeContent] = useState<string>('');
//   const containerRef = useRef<HTMLDivElement>(null);
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const cleanupFunctionsRef = useRef<Array<() => void>>([]);

//   // Enhanced security measures
//   const enableSecurityMeasures = () => {
//     const cleanupFunctions: Array<() => void> = [];

//     // Disable right-click context menu
//     const handleContextMenu = (e: MouseEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       return false;
//     };

//     // Disable key shortcuts for dev tools, view source, etc.
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (
//         e.key === 'F12' ||
//         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
//         (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
//         (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
//         (e.ctrlKey && (e.key === 'p' || e.key === 'P'))
//       ) {
//         e.preventDefault();
//         e.stopPropagation();
//         return false;
//       }
//     };

//     // Disable text selection
//     const disableSelection = () => {
//       document.body.style.userSelect = 'none';
//       document.body.style.webkitUserSelect = 'none';
//       document.body.style.mozUserSelect = 'none';
//       document.body.style.msUserSelect = 'none';
//     };

//     // Add event listeners
//     document.addEventListener('contextmenu', handleContextMenu, true);
//     document.addEventListener('keydown', handleKeyDown, true);
    
//     disableSelection();

//     // Cleanup functions
//     cleanupFunctions.push(() => {
//       document.removeEventListener('contextmenu', handleContextMenu, true);
//       document.removeEventListener('keydown', handleKeyDown, true);
      
//       document.body.style.userSelect = '';
//       document.body.style.webkitUserSelect = '';
//       document.body.style.mozUserSelect = '';
//       document.body.style.msUserSelect = '';
//     });

//     return cleanupFunctions;
//   };

//   // Progress simulation during loading
//   const simulateProgress = () => {
//     const progressInterval = setInterval(() => {
//       setLoadingProgress(prev => {
//         if (prev >= 90) {
//           clearInterval(progressInterval);
//           return 90;
//         }
//         return prev + Math.random() * 10;
//       });
//     }, 200);

//     return () => clearInterval(progressInterval);
//   };

//   // Fetch content without adding to history
//   const fetchSecureContent = async (url: string) => {
//     try {
//       // Use fetch to get the content instead of direct iframe loading
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Cache-Control': 'no-cache, no-store, must-revalidate',
//           'Pragma': 'no-cache',
//           'Expires': '0'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const content = await response.text();
      
//       // Modify the content to remove any potential history-affecting elements
//       const modifiedContent = content
//         .replace(/<base\s+href="[^"]*"/gi, '') // Remove base href
//         .replace(/history\.pushState/gi, '// history.pushState') // Disable pushState
//         .replace(/history\.replaceState/gi, '// history.replaceState') // Disable replaceState
//         .replace(/window\.location\.href/gi, '""') // Neutralize location changes
//         .replace(/window\.open/gi, '// window.open'); // Disable window.open

//       return modifiedContent;
//     } catch (error) {
//       console.error('Error fetching content:', error);
//       throw error;
//     }
//   };

//   // Load the actual content
//   const loadSecureContent = async () => {
//     try {
//       setIsLoading(true);
//       setLoadingProgress(0);
      
//       // Start progress simulation
//       const stopProgress = simulateProgress();
      
//       // Immediately manipulate history to prevent URL tracking
//       if (window.history.replaceState) {
//         window.history.replaceState(null, '', window.location.pathname);
//       }
      
//       // Clear any existing history entries
//       try {
//         // This will prevent the URL from being added to history
//         while (window.history.length > 1) {
//           window.history.back();
//         }
//       } catch (e) {
//         console.log('History manipulation limited by browser security');
//       }

//       setLoadingProgress(30);
      
//       // Fetch content securely
//       const content = await fetchSecureContent(projectUrl);
//       setIframeContent(content);
      
//       setLoadingProgress(90);
      
//       // Wait a bit for security measures to take effect
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Complete progress
//       setLoadingProgress(100);
      
//       // Small delay for smooth transition
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       stopProgress();
//       setIsLoading(false);
//       setIsSecureMode(true);
      
//     } catch (error) {
//       console.error('Error loading content:', error);
//       setError('Failed to load project in secure mode. The URL might be blocked by CORS policy.');
//       setIsLoading(false);
//     }
//   };

//   // Comprehensive cleanup
//   const performCleanup = () => {
//     try {
//       // Clear all storage
//       if (typeof Storage !== 'undefined') {
//         localStorage.clear();
//         sessionStorage.clear();
//       }
      
//       // Clear cookies
//       document.cookie.split(";").forEach(cookie => {
//         const eqPos = cookie.indexOf("=");
//         const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
//         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
//         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//       });
      
//       // Clear cache
//       if ('caches' in window) {
//         caches.keys().then(names => {
//           names.forEach(name => caches.delete(name));
//         });
//       }

//       // Multiple history clearing attempts
//       try {
//         // Replace current state
//         if (window.history.replaceState) {
//           window.history.replaceState(null, '', window.location.pathname);
//         }
        
//         // Clear forward history
//         if (window.history.forward) {
//           window.history.forward();
//           window.history.back();
//         }
        
//         // Additional history manipulation
//         const currentUrl = window.location.pathname;
//         window.history.pushState(null, '', currentUrl);
//         window.history.replaceState(null, '', currentUrl);
        
//       } catch (e) {
//         console.log('History cleanup limited by browser security');
//       }

//       // Run cleanup functions
//       cleanupFunctionsRef.current.forEach(cleanup => cleanup());
//       cleanupFunctionsRef.current = [];
      
//     } catch (error) {
//       console.error('Error during cleanup:', error);
//     }
//   };

//   const handleBack = () => {
//     performCleanup();
//     onBack();
//   };

//   const handleIframeLoad = () => {
//     setIsLoading(false);
//     setIsSecureMode(true);
    
//     // Additional history cleanup after iframe load
//     setTimeout(() => {
//       if (window.history.replaceState) {
//         window.history.replaceState(null, '', window.location.pathname);
//       }
//     }, 100);
//   };

//   const handleIframeError = () => {
//     setError('Failed to load the project. The URL might be invalid or blocked.');
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     // Enable security measures
//     const cleanupFunctions = enableSecurityMeasures();
//     cleanupFunctionsRef.current = cleanupFunctions;
    
//     // Immediate history manipulation
//     if (window.history.replaceState) {
//       window.history.replaceState(null, '', window.location.pathname);
//     }
    
//     // Load content
//     loadSecureContent();
    
//     // Cleanup on unmount
//     return () => {
//       cleanupFunctions.forEach(cleanup => cleanup());
//       performCleanup();
//     };
//   }, [projectUrl]);

//   // Handle beforeunload and page visibility
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       performCleanup();
//     };
    
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         performCleanup();
//       }
//     };
    
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, []);

//   // Handle popstate to prevent back navigation to hidden content
//   useEffect(() => {
//     const handlePopState = (e: PopStateEvent) => {
//       e.preventDefault();
//       performCleanup();
//       onBack();
//     };
    
//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, [onBack]);

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-red-900 flex items-center justify-center z-50">
//         <div className="text-center text-white max-w-md mx-auto p-6">
//           <div className="text-red-400 mb-4">
//             <Shield size={48} className="mx-auto" />
//           </div>
//           <h2 className="text-xl font-semibold mb-2">Access Error</h2>
//           <p className="text-red-200 mb-6">{error}</p>
//           <button
//             onClick={handleBack}
//             className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//           >
//             Return to Calculator
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div 
//       ref={containerRef}
//       className="fixed inset-0 bg-black z-50"
//       style={{ 
//         userSelect: 'none',
//         WebkitUserSelect: 'none',
//         MozUserSelect: 'none',
//         msUserSelect: 'none'
//       }}
//     >
//       {/* Secure Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-gray-800">
//         <div className="flex items-center justify-between px-4 py-3">
//           <button
//             onClick={handleBack}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white text-sm font-medium"
//           >
//             <ArrowLeft size={16} />
//             Exit Secure Mode
//           </button>
          
//           <div className="flex items-center gap-2 text-green-400 text-sm">
//             <Lock size={16} />
//             <span>Secure Session Active</span>
//           </div>
          
//           <div className="text-xs text-gray-500">
//             @Developed by Krushna Soni
//           </div>
//         </div>
//       </nav>

//       {/* Loading Screen */}
//       {isLoading && (
//         <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-600 to-blue-600">
//           <div className="text-center text-white max-w-md mx-auto p-6">
//             {/* Animated Loading Circle */}
//             <div className="relative mx-auto mb-6 w-20 h-20">
//               <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
//               <div 
//                 className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"
//                 style={{ 
//                   animationDuration: '1s',
//                   transformOrigin: 'center'
//                 }}
//               ></div>
//               <div className="absolute inset-2 bg-white/10 rounded-full flex items-center justify-center">
//                 <Shield size={24} className="text-white" />
//               </div>
//             </div>

//             <h2 className="text-2xl font-bold mb-2">Secure Project Access</h2>
//             <p className="text-white/90 mb-1">Loading content in secure mode...</p>
//             <p className="text-white/70 text-sm mb-6">No traces will be left in your browser history or data.</p>
            
//             {/* Progress Bar */}
//             <div className="w-full bg-white/20 rounded-full h-2 mb-4">
//               <div 
//                 className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
//                 style={{ width: `${loadingProgress}%` }}
//               ></div>
//             </div>
//             <div className="text-white/60 text-sm mb-6">{Math.round(loadingProgress)}% Complete</div>

//             <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
//               <Lock size={16} />
//               <span>Establishing secure connection...</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content Area */}
//       {!isLoading && isSecureMode && (
//         <div className="pt-16 h-full bg-black">
//           <iframe
//             ref={iframeRef}
//             srcDoc={iframeContent}
//             className="w-full h-full border-0 bg-white"
//             title="Hidden Project"
//             sandbox="allow-scripts allow-forms allow-popups allow-modals"
//             referrerPolicy="no-referrer"
//             onLoad={handleIframeLoad}
//             onError={handleIframeError}
//             style={{
//               height: 'calc(100vh - 4rem)',
//               display: 'block'
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };



import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Shield, Lock, ExternalLink } from 'lucide-react';

interface HiddenProjectProps {
  onBack: () => void;
  projectUrl: string;
}

export const HiddenProject = ({ onBack, projectUrl }: HiddenProjectProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);
  const hiddenWindowRef = useRef<Window | null>(null);

  // Enhanced security measures
  const enableSecurityMeasures = () => {
    const cleanupFunctions: Array<() => void> = [];

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable key shortcuts for dev tools, view source, etc.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable text selection
    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    
    disableSelection();

    // Cleanup functions
    cleanupFunctions.push(() => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    });

    return cleanupFunctions;
  };

  // Progress simulation during loading
  const simulateProgress = () => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  };

  // Check if the hidden project is accessible
  const checkProjectAccess = async () => {
    try {
      setConnectionStatus('checking');
      
      // Try to check if the backend is accessible
      const backendUrl = 'https://svvhqp0l-5000.inc1.devtunnels.ms';
      const response = await fetch(`${backendUrl}/api/config`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('failed');
        return false;
      }
    } catch (error) {
      console.error('Project access check failed:', error);
      setConnectionStatus('failed');
      return false;
    }
  };

  // Load the project using iframe with proper setup
  const loadSecureProject = async () => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      
      // Start progress simulation
      const stopProgress = simulateProgress();
      
      // Manipulate history to prevent URL tracking
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      setLoadingProgress(30);
      
      // Check if project is accessible
      const isAccessible = await checkProjectAccess();
      
      if (!isAccessible) {
        throw new Error('Project server is not accessible');
      }
      
      setLoadingProgress(60);
      
      // Wait for security measures to take effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoadingProgress(90);
      
      // Complete progress
      setLoadingProgress(100);
      
      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      stopProgress();
      setIsLoading(false);
      setIsSecureMode(true);
      
    } catch (error) {
      console.error('Error loading project:', error);
      setConnectionStatus('failed');
      setIsLoading(false);
    }
  };

  // Open project in a controlled popup window
  const openSecureWindow = () => {
    try {
      // Close any existing window
      if (hiddenWindowRef.current) {
        hiddenWindowRef.current.close();
      }

      // Open new window with security features
      const windowFeatures = [
        'width=1200',
        'height=800',
        'left=100',
        'top=100',
        'menubar=no',
        'toolbar=no',
        'location=no',
        'status=no',
        'scrollbars=yes',
        'resizable=yes'
      ].join(',');

      hiddenWindowRef.current = window.open(
        projectUrl,
        'HiddenProject',
        windowFeatures
      );

      if (hiddenWindowRef.current) {
        // Focus the new window
        hiddenWindowRef.current.focus();
        
        // Monitor window close
        const checkClosed = setInterval(() => {
          if (hiddenWindowRef.current?.closed) {
            clearInterval(checkClosed);
            performCleanup();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error opening secure window:', error);
    }
  };

  // Comprehensive cleanup
  const performCleanup = () => {
    try {
      // Clear all storage
      if (typeof Storage !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Clear cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      // Clear cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      // Close popup window if open
      if (hiddenWindowRef.current) {
        hiddenWindowRef.current.close();
        hiddenWindowRef.current = null;
      }

      // Multiple history clearing attempts
      try {
        if (window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } catch (e) {
        console.log('History cleanup limited by browser security');
      }

      // Run cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
      
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const handleBack = () => {
    performCleanup();
    onBack();
  };

  useEffect(() => {
    // Enable security measures
    const cleanupFunctions = enableSecurityMeasures();
    cleanupFunctionsRef.current = cleanupFunctions;
    
    // Immediate history manipulation
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Load project
    loadSecureProject();
    
    // Cleanup on unmount
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      performCleanup();
    };
  }, [projectUrl]);

  // Handle beforeunload and page visibility
  useEffect(() => {
    const handleBeforeUnload = () => {
      performCleanup();
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        performCleanup();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle popstate to prevent back navigation to hidden content
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      performCleanup();
      onBack();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onBack]);

  if (connectionStatus === 'failed') {
    return (
      <div className="fixed inset-0 bg-red-900 flex items-center justify-center z-50">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="text-red-400 mb-4">
            <Shield size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-red-200 mb-2">Unable to connect to the hidden project.</p>
          <p className="text-red-300 text-sm mb-6">Please ensure the project server is running.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Return to Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50"
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Secure Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Exit Secure Mode
          </button>
          
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Lock size={16} />
            <span>Secure Session Active</span>
          </div>
          
          <div className="text-xs text-gray-500">
            @Developed by Krushna Soni
          </div>
        </div>
      </nav>

      {/* Loading Screen */}
      {isLoading && (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="text-center text-white max-w-md mx-auto p-6">
            {/* Animated Loading Circle */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"
                style={{ 
                  animationDuration: '1s',
                  transformOrigin: 'center'
                }}
              ></div>
              <div className="absolute inset-2 bg-white/10 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Secure Project Access</h2>
            <p className="text-white/90 mb-1">Establishing secure connection...</p>
            <p className="text-white/70 text-sm mb-6">
              {connectionStatus === 'checking' ? 'Checking server availability...' : 
               connectionStatus === 'connected' ? 'Server connected successfully!' : 
               'Preparing secure environment...'}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-white/60 text-sm mb-6">{Math.round(loadingProgress)}% Complete</div>

            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Lock size={16} />
              <span>No traces will be left in your browser history</span>
            </div>
          </div>
        </div>
      )}

      {/* Secure Access Panel */}
      {!isLoading && isSecureMode && connectionStatus === 'connected' && (
        <div className="pt-16 h-full bg-black flex items-center justify-center">
          <div className="text-center text-white max-w-md mx-auto p-6">
            <div className="text-green-400 mb-6">
              <Shield size={64} className="mx-auto" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Secure Access Ready</h2>
            <p className="text-white/90 mb-2">Hidden project is accessible and secure.</p>
            <p className="text-white/70 text-sm mb-8">Click below to open in a secure environment.</p>
            
            <div className="space-y-4">
              <button
                onClick={openSecureWindow}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <ExternalLink size={20} />
                Open Hidden Project
              </button>
              
              <div className="text-xs text-gray-400 max-w-sm">
                This will open the project in a secure popup window. All traces will be automatically cleared when you close it.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Iframe Option (Alternative) */}
      {!isLoading && isSecureMode && connectionStatus === 'connected' && false && (
        <div className="pt-16 h-full bg-black">
          <iframe
            ref={iframeRef}
            src={projectUrl}
            className="w-full h-full border-0 bg-white"
            title="Hidden Project"
            sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
            referrerPolicy="no-referrer"
            style={{
              height: 'calc(100vh - 4rem)',
              display: 'block'
            }}
          />
        </div>
      )}
    </div>
  );
};