<?php

declare(strict_types=1);

namespace App\Api\Exceptions;

use App\Exceptions\ApiRefused;

/**
 * The profile does not allow this call: the journal answered forbidden.
 */
final class NotAllowed extends ApiRefused
{
    public const string CODE = 'forbidden';
}
