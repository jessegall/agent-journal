<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What the driver's own check of an account folder said on the host: signed in, definitely signed out, or nothing
 * certain, such as a network error. Only a definite sign-out changes the account.
 */
enum AccountCheckResult: string
{
    case SignedIn = 'signed_in';
    case SignedOut = 'signed_out';
    case Unknown = 'unknown';
}
