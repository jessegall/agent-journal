<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The continuation is no longer valid: the journal answered stale_continuation.
 */
final class StaleContinuation extends CallRefused
{
    public const string CODE = 'stale_continuation';
}
