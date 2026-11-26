<?php

declare(strict_types=1);

namespace App\Api\Exceptions;

use App\Exceptions\ApiRefused;

/**
 * The call reached the journal after its deadline: the journal answered deadline_expired.
 */
final class DeadlineExpired extends ApiRefused
{
    public const string CODE = 'deadline_expired';
}
