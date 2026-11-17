<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Hooks\Storage\StackTarget;
use RuntimeException;

final class StackAlreadyClosed extends RuntimeException
{
    public static function forTarget(StackTarget $target): self
    {
        return new self("The stack of agent {$target->agentId}, session {$target->sessionId} is closed.");
    }
}
