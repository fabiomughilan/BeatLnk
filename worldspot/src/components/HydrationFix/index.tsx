'use client';
import { useEffect } from 'react';

export default function HydrationFix() {
  useEffect(() => {
    // Fix hydration mismatch caused by browser extensions
    const fixExtensionAttributes = () => {
      const body = document.body;
      if (body) {
        // Remove extension-added attributes that cause hydration mismatches
        const extensionAttributes = [
          'data-channel-name',
          'data-extension-id', 
          'data-new-gr-c-s-check-loaded',
          'data-gr-ext-installed'
        ];
        
        extensionAttributes.forEach(attr => {
          if (body.hasAttribute(attr)) {
            body.removeAttribute(attr);
          }
        });
      }
    };

    // Run immediately and after a short delay
    fixExtensionAttributes();
    const timeoutId = setTimeout(fixExtensionAttributes, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return null; // This component doesn't render anything
}
