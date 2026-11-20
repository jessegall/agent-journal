<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Agents\Enums\StartUnavailableReason;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a saved account stands: signed in, waiting for its owner to sign in again, being removed, or removed with its
 * label kept for the starts that used it.
 */
#[TypeScript]
enum AccountState: string
{
    case SignedIn = 'signed_in';
    case NeedsSignIn = 'needs_sign_in';
    case Removing = 'removing';
    case Removed = 'removed';

    public function canStart(): bool
    {
        return $this === self::SignedIn;
    }

    /**
     * Why a start cannot use an account in this state, as the agent that asked is told it.
     */
    public function startUnavailableReason(): StartUnavailableReason
    {
        return match ($this) {
            self::SignedIn, self::Removing => StartUnavailableReason::Maintenance,
            self::NeedsSignIn => StartUnavailableReason::NeedsSignIn,
            self::Removed => StartUnavailableReason::NoAccount,
        };
    }
}
