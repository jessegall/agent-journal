<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\Concerns\ThrowsLater;
use LogicException;

/**
 * Something asked who the calling agent is in a request the agent middleware did not authenticate.
 */
final class AgentContextMissing extends LogicException
{
    /**
     * @use ThrowsLater<AgentContextMissing>
     */
    use ThrowsLater;

    public static function forRequest(): self
    {
        return new self(
            'This request has no authenticated agent; only requests through the agent middleware have one.',
        );
    }
}
