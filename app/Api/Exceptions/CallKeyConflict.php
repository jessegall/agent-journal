<?php

declare(strict_types=1);

namespace App\Api\Exceptions;

use App\Exceptions\ApiRefused;

/**
 * The request key was used for a different call: the journal answered request_key_conflict.
 */
final class CallKeyConflict extends ApiRefused
{
    public const string CODE = 'request_key_conflict';
}
