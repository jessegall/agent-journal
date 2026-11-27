<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Accounts\Enums\SignInMethod;

/**
 * What a driver's sign-in status command said of an account folder: whether it could be read, whether it holds a
 * sign-in the journal accepts and by which method, and the account's email and expiry when the driver names them.
 */
final readonly class SignInReport
{
    public function __construct(
        public bool $isReadable,
        public bool $isSignedIn,
        public SignInMethod|null $method,
        public string|null $email = null,
        public string|null $expiresAt = null,
        /**
         * The organization the sign-in belongs to, where the driver names one
         */
        public string|null $organization = null,
    ) {}

    public static function unreadable(): self
    {
        return new self(false, false, null);
    }

    /**
     * Whether the folder is signed in by exactly this method; another method found there is the wrong one.
     */
    public function isSignedInBy(SignInMethod $method): bool
    {
        return $this->isSignedIn && $this->method === $method;
    }
}
