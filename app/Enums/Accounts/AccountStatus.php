<?php

declare(strict_types=1);

namespace App\Enums\Accounts;

use App\Enums\Sessions\StartUnavailableReason;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a saved account stands: signed in, waiting for its owner to sign in again, being removed, or removed with its
 * label kept for the starts that used it.
 */
#[TypeScript]
enum AccountStatus: string
{
    case Authenticated = 'authenticated';
    case Unauthenticated = 'unauthenticated';
    case Removing = 'removing';
    case Removed = 'removed';

    public function canStart(): bool
    {
        return $this === self::Authenticated;
    }

    /**
     * Why a start cannot use an account in this state, as the agent that asked is told it.
     */
    public function startUnavailableReason(): StartUnavailableReason
    {
        return match ($this) {
            self::Authenticated, self::Removing => StartUnavailableReason::Maintenance,
            self::Unauthenticated => StartUnavailableReason::NeedsSignIn,
            self::Removed => StartUnavailableReason::NoAccount,
        };
    }
}
