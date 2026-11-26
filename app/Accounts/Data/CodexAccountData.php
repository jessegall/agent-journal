<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Data;

/**
 * The account Codex's account/read answers with: its type, chatgpt for a ChatGPT sign-in, and the email it shows.
 */
final class CodexAccountData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string|null $email = null,
    ) {}
}
