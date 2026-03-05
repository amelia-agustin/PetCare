export interface FieldError {
  field: string;
  message: string;
}

//  Email
export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email address.';
  return null;
}

// Password
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Include at least one number.';
  return null;
}

// Confirm Password
export function validateConfirmPassword(
  password: string,
  confirm: string
): string | null {
  if (!confirm) return 'Please confirm your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return null;
}

// Name
export function validateName(name: string): string | null {
  if (!name.trim()) return 'Full name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
}

// Sign In form validator
export function validateSignInForm(email: string, password: string): FieldError[] {
  const errors: FieldError[] = [];
  const emailErr    = validateEmail(email);
  const passwordErr = password.length === 0 ? 'Password is required.' : null;
  if (emailErr)    errors.push({ field: 'email',    message: emailErr });
  if (passwordErr) errors.push({ field: 'password', message: passwordErr });
  return errors;
}

// Sign Up form validator
export function validateSignUpForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldError[] {
  const errors: FieldError[] = [];
  const nameErr    = validateName(name);
  const emailErr   = validateEmail(email);
  const passErr    = validatePassword(password);
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (nameErr)    errors.push({ field: 'name',            message: nameErr });
  if (emailErr)   errors.push({ field: 'email',           message: emailErr });
  if (passErr)    errors.push({ field: 'password',        message: passErr });
  if (confirmErr) errors.push({ field: 'confirmPassword', message: confirmErr });
  return errors;
}