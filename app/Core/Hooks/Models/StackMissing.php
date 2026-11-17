<?php

declare(strict_types=1);

namespace App\Core\Hooks\Models;

use App\Core\Hooks\Storage\StackTarget;
use RuntimeException;

final class StackMissing extends RuntimeException
{
    public static function forTarget(StackTarget $target): self
    {
        return new self("Agent {$target->agentId}, session {$target->sessionId} has no stack; its launch creates one.");
    }
}
