export const storeInSession = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Failed to store in session:", error);
  }
};

export const lookInSession = (key) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to read from session:", error);
    return null;
  }
};

export const removeFromSession = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from session:", error);
  }
};

export const clearSession = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
};
