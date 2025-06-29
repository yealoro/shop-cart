export function getPasswordStrength(password: string) {
  let score = 0;
  if (!password) {
    return { strength: "none", score: 0 };
  }

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character combination
  if (/[A-Z]/.test(password)) score += 1; // Uppercase letters
  if (/[a-z]/.test(password)) score += 1; // Lowercase letters
  if (/\d/.test(password)) score += 1;    // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special characters

  let strength: "none" | "weak" | "medium" | "strong" = "none";
  if (score < 3) {
    strength = "weak";
  } else if (score < 5) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return { strength, score };
}