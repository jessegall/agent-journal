<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;

/**
 * What the sign-in form sends to Fortify's login action.
 */
final class LoginInput extends Data
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly bool $remember,
    ) {}

    public static function blank(): self
    {
        return new self(email: '', password: '', remember: false);
    }
}
