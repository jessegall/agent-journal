<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the sign-in form sends to Fortify's login action.
 */
#[TypeScript]
final class LoginInput extends Data
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly bool $shouldRemember,
    ) {}

    public static function blank(): self
    {
        return new self(email: '', password: '', shouldRemember: false);
    }

    /**
     * The form already filled with the local development account, so Enter signs in.
     */
    public static function filledWith(string $email, string $password): self
    {
        return new self(email: $email, password: $password, shouldRemember: false);
    }
}
