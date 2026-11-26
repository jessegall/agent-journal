<?php

declare(strict_types=1);

namespace App\Api\Exceptions;

use App\Exceptions\ApiRefused;

/**
 * The call was cancelled: the journal answered cancelled.
 */
final class ApiCancelled extends ApiRefused
{
    public const string CODE = 'cancelled';
}
