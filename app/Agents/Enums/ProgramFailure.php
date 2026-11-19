<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Why a program said a launch's request failed, in the checked vocabulary of its failure signal; anything unchecked
 * is Unknown, never proof that the account signed out.
 */
enum ProgramFailure: string
{
    case RateLimit = 'rate_limit';
    case AuthenticationFailed = 'authentication_failed';
    case OrganizationNotAllowed = 'oauth_org_not_allowed';
    case AccountOnHold = 'account_on_hold';
    case BillingError = 'billing_error';
    case ServerError = 'server_error';
    case Unknown = 'unknown';

    /**
     * The failure a program's checked error code names; a code outside the checked vocabulary is Unknown.
     */
    public static function fromCheckedCode(string $code): self
    {
        return self::tryFrom($code) ?? self::Unknown;
    }

    /**
     * Only a rejected sign-in asks for a private check of the account; one such failure alone never signs it out.
     */
    public function needsAccountCheck(): bool
    {
        return $this === self::AuthenticationFailed;
    }
}
