<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Values\AccountUse;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One recent start on an account in the account list, linking to the start's account page.
 */
#[TypeScript]
final class AccountStartData extends Data
{
    public function __construct(
        public readonly string $sessionId,
        public readonly string $startedAt,
        public readonly bool $isRunning,
    ) {}

    public static function fromUse(AccountUse $use): self
    {
        return new self($use->sessionId, $use->startedAt->toIso8601String(), $use->isRunning());
    }
}
