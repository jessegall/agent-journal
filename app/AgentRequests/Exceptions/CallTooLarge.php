<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The answer is larger than the call allows: the journal answered too_large.
 */
final class CallTooLarge extends CallRefused
{
    public const string CODE = 'too_large';
}
