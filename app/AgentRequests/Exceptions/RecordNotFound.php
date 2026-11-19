<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The record does not exist or is not available: the journal answered record_unavailable.
 */
final class RecordNotFound extends CallRefused
{
    public const string CODE = 'record_unavailable';
}
