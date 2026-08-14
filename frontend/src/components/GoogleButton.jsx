import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// Renders Google's official "Sign in with Google" button and forwards the
// returned ID token credential to the backend via AuthContext.googleLogin.
export default function GoogleButton({ onSuccess, onError }) {
  const { googleLogin } = useAuth();
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set — Google Sign-In button will not render.');
      return;
    }

    const handleCredential = async (response) => {
      try {
        const profile = await googleLogin(response.credential);
        onSuccess?.(profile);
      } catch (err) {
        onError?.(err.response?.data?.message || 'Google sign-in failed');
      }
    };

    const init = () => {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
        shape: 'rectangular',
      });
    };

    // The GSI script is loaded async in index.html; poll briefly until ready.
    if (window.google) {
      init();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          init();
        }
      }, 100);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={buttonRef} className="google-btn-wrapper" />;
}
