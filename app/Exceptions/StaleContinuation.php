<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The continuation is no longer valid: the journal answered stale_continuation.
 */
final class StaleContinuation extends ApiRefused
{
    public const string CODE = 'stale_continuation';
}
