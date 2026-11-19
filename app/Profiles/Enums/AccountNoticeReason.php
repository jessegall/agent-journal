<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Agents\Enums\LaunchUnavailableReason;
use App\Agents\Enums\ProgramFailure;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why the owner is told to look at a program's accounts: no account is chosen, the chosen one must sign in again, it
 * is held while it changes, a request was rejected as signed out, or the provider limits the account.
 */
#[TypeScript]
enum AccountNoticeReason: string
{
    case NoAccount = 'no_account';
    case NeedsSignIn = 'needs_sign_in';
    case Maintenance = 'maintenance';
    case SignInRejected = 'sign_in_rejected';
    case AccountLimited = 'account_limited';

    public static function forLaunch(LaunchUnavailableReason $reason): self
    {
        return match ($reason) {
            LaunchUnavailableReason::NoAccount => self::NoAccount,
            LaunchUnavailableReason::NeedsSignIn => self::NeedsSignIn,
            LaunchUnavailableReason::Maintenance => self::Maintenance,
        };
    }

    /**
     * The notice a program failure leaves, or none for a failure the owner need not act on.
     */
    public static function forFailure(ProgramFailure $failure): self|null
    {
        return match ($failure) {
            ProgramFailure::AuthenticationFailed => self::SignInRejected,
            ProgramFailure::RateLimit, ProgramFailure::AccountOnHold, ProgramFailure::BillingError,
            ProgramFailure::OrganizationNotAllowed => self::AccountLimited,
            ProgramFailure::ServerError, ProgramFailure::Unknown => null,
        };
    }
}
