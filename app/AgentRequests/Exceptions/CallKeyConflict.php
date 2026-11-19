<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The request key was used for a different call: the journal answered request_key_conflict.
 */
final class CallKeyConflict extends CallRefused
{
    public const string CODE = 'request_key_conflict';
}
