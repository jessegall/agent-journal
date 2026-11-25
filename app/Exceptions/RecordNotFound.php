<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The record does not exist or is not available: the journal answered record_unavailable.
 */
final class RecordNotFound extends ApiRefused
{
    public const string CODE = 'record_unavailable';
}
