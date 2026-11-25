<?php

declare(strict_types=1);

namespace App\Enums\Accounts;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use App\Enums\Drivers\DriverFailure;
use App\Enums\Starts\StartUnavailableReason;

/**
 * Why the owner is told to look at a driver's accounts: no account is chosen, the chosen one must sign in again, it
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

    /**
     * The notice a refused start leaves, or none when the owner chose the account and was told why on the spot.
     */
    public static function forStart(StartUnavailableReason $reason): self|null
    {
        return match ($reason) {
            StartUnavailableReason::NoAccount => self::NoAccount,
            StartUnavailableReason::NeedsSignIn => self::NeedsSignIn,
            StartUnavailableReason::Maintenance => self::Maintenance,
            StartUnavailableReason::ChosenAccountMissing, StartUnavailableReason::ChosenAccountChanged => null,
        };
    }

    /**
     * The notice a driver failure leaves, or none for a failure the owner need not act on.
     */
    public static function forFailure(DriverFailure $failure): self|null
    {
        return match ($failure) {
            DriverFailure::AuthenticationFailed => self::SignInRejected,
            DriverFailure::RateLimit, DriverFailure::AccountOnHold, DriverFailure::BillingError,
            DriverFailure::OrganizationNotAllowed => self::AccountLimited,
            DriverFailure::ServerError, DriverFailure::Unknown => null,
        };
    }
}
