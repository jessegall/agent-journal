<?php

declare(strict_types=1);

namespace App\Api\Exceptions;

use App\Exceptions\ApiRefused;

/**
 * The journal did not accept the start token: the journal answered unauthenticated.
 */
final class NotAuthenticated extends ApiRefused
{
    public const string CODE = 'unauthenticated';
}
