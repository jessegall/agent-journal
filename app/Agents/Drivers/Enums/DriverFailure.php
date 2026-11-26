<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * Why a driver said a start's request failed, in the checked vocabulary of its failure signal; anything unchecked
 * is Unknown, never proof that the account signed out.
 */
enum DriverFailure: string
{
    case RateLimit = 'rate_limit';
    case AuthenticationFailed = 'authentication_failed';
    case OrganizationNotAllowed = 'oauth_org_not_allowed';
    case AccountOnHold = 'account_on_hold';
    case BillingError = 'billing_error';
    case ServerError = 'server_error';
    case Unknown = 'unknown';

    /**
     * The failure a driver's checked error code names; a code outside the checked vocabulary is Unknown.
     */
    public static function fromCheckedCode(string $code): self
    {
        return self::tryFrom($code) ?? self::Unknown;
    }

    /**
     * Only a rejected sign-in asks for a private check of the account; one such failure alone never signs it out.
     */
    public function isAccountCheckNeeded(): bool
    {
        return $this === self::AuthenticationFailed;
    }
}
