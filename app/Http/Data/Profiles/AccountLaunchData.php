<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Agents\Support\AccountUse;
use Spatie\LaravelData\Data;

/**
 * One recent launch on an account in the account list, linking to the launch's account page.
 */
final class AccountLaunchData extends Data
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
