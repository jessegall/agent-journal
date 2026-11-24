<?php

declare(strict_types=1);

namespace App\Values;

use Carbon\CarbonImmutable;

/**
 * Who a sign-in proved, kept apart: the text shown to the user (an email or an organization), the provider's own
 * subject, the workspace or organization it signed in to, and when its login expires, as ISO 8601 text. Each is absent when the
 * driver's proof did not name it.
 */
final readonly class SignInIdentity
{
    public function __construct(
        public string|null $display,
        public string|null $subject,
        public string|null $workspace,
        public string|null $expiresAt = null,
    ) {}

    /**
     * When the login expires, read from the ISO 8601 time the driver's check printed.
     */
    public function expiry(): CarbonImmutable|null
    {
        if ($this->expiresAt === null) {
            return null;
        }

        return CarbonImmutable::parse($this->expiresAt);
    }

    /**
     * The identity of a sign-in whose proof named nobody.
     */
    public static function unproved(): self
    {
        return new self(null, null, null);
    }

    /**
     * Only the text shown to the user, as a driver's status check names it.
     */
    public static function shown(string|null $display): self
    {
        return new self($display, null, null);
    }
}
