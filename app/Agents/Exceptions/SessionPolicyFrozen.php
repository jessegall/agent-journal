<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use LogicException;

/**
 * A session's policy is frozen at its launch; nothing changes it afterwards.
 */
final class SessionPolicyFrozen extends LogicException
{
    public static function forSession(string $sessionId): self
    {
        return new self("The policy of session {$sessionId} was frozen at its launch and cannot change.");
    }
}
