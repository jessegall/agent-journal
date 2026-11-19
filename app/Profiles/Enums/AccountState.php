<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Agents\Enums\LaunchUnavailableReason;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a saved account stands: signed in, waiting for its owner to sign in again, being removed, or removed with its
 * label kept for the launches that used it.
 */
#[TypeScript]
enum AccountState: string
{
    case SignedIn = 'signed_in';
    case NeedsSignIn = 'needs_sign_in';
    case Removing = 'removing';
    case Removed = 'removed';

    public function acceptsLaunches(): bool
    {
        return $this === self::SignedIn;
    }

    /**
     * Why a launch cannot use an account in this state, as the agent that asked may hear it.
     */
    public function launchUnavailableReason(): LaunchUnavailableReason
    {
        return match ($this) {
            self::SignedIn, self::Removing => LaunchUnavailableReason::Maintenance,
            self::NeedsSignIn => LaunchUnavailableReason::NeedsSignIn,
            self::Removed => LaunchUnavailableReason::NoAccount,
        };
    }
}
