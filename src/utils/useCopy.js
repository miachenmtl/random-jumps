import { useState, useEffect, useRef } from "react";

const copyToClipboard = async (text, callback) => {
  await navigator.clipboard.writeText(text);
  callback();
};

function useCopy(copyCallback, resetCallback, lang) {
  const [hasCopied, setHasCopied] = useState(false);
  const timeoutId = useRef(null);

  useEffect(() => {
    if (hasCopied) {
      timeoutId.current = window.setTimeout(() => {
        resetCallback();
        setHasCopied(false);
      }, 700);
    }
    return () => {
      if (hasCopied) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, [hasCopied, resetCallback, lang]);

  const handleCopy = (string) => {
    copyToClipboard(string, () => {
      copyCallback();
      setHasCopied(true);
    });
  };

  return handleCopy;
}

export default useCopy;
