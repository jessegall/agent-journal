<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * What a host cleans up: a removed account's sign-in and folder, or the folder a new account's sign-in left behind
 * when it never finished.
 */
enum CleanupTarget: string
{
    case Account = 'account';
    case SignInAttempt = 'sign_in_attempt';
}
