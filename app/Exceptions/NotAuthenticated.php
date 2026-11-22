<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The journal did not accept the start token: the journal answered unauthenticated.
 */
final class NotAuthenticated extends CallRefused
{
    public const string CODE = 'unauthenticated';
}
