
/**
 * Utility functions for file encryption and decryption
 * 
 * NOTE: This is a simplified mock implementation for demonstration purposes.
 * In a production environment, use established encryption libraries and proper key management.
 */

/**
 * Simple encryption function using XOR and Base64 encoding
 * @param content - The content to encrypt
 * @param password - The password to use for encryption
 * @returns The encrypted content
 */
export function encrypt(content: string, password: string): string {
  if (!content) return '';
  
  // Create a repeating key from the password
  const key = createKey(password, content.length);
  
  // XOR operation between content and key
  let result = '';
  for (let i = 0; i < content.length; i++) {
    result += String.fromCharCode(content.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  
  // Convert to Base64 for safe storage
  return btoa(result);
}

/**
 * Simple decryption function using XOR and Base64 decoding
 * @param encryptedContent - The encrypted content
 * @param password - The password to use for decryption
 * @returns The decrypted content
 */
export function decrypt(encryptedContent: string, password: string): string {
  if (!encryptedContent) return '';
  
  try {
    // Decode from Base64
    const decoded = atob(encryptedContent);
    
    // Create a repeating key from the password
    const key = createKey(password, decoded.length);
    
    // XOR operation between decoded content and key
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    
    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Helper function to create a repeating key
 * @param password - The password to use
 * @param length - The desired key length
 * @returns The generated key
 */
function createKey(password: string, length: number): string {
  let key = '';
  while (key.length < length) {
    key += password;
  }
  return key.slice(0, length);
}

/**
 * Generate a hash of a string (simplified for demo purposes)
 * @param input - The input string to hash
 * @returns A simple hash of the input
 */
export function simpleHash(input: string): string {
  let hash = 0;
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}
