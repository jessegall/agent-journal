<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A prepared call that got no answer: the journal was unreachable, or its deadline passed before it could be sent.
 * The message never names the launch token or the body.
 */
final class AgentCallUnsent extends RuntimeException
{
    public static function unreachable(string $journalUrl, Throwable $previous): self
    {
        return new self("The journal at {$journalUrl} did not answer.", 0, $previous);
    }

    public static function deadlinePassed(string $callId): self
    {
        return new self("The deadline of call {$callId} passed before it was sent.");
    }
}
