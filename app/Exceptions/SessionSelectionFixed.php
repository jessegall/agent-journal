<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A second write of a session's driver and model: a session keeps the selection it was started with.
 */
final class SessionSelectionFixed extends LogicException
{
    public static function forSession(string $sessionId): self
    {
        return new self("Session {$sessionId} already has its driver and model; a new selection needs a new start.");
    }
}
