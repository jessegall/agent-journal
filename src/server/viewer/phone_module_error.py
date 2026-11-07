class PhoneModuleError(Exception):
    """Raised when the phone module refuses a code or holds no paired phone for a token, with its reason."""
