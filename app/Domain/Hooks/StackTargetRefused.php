<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Storage\StackTarget;
use RuntimeException;

final class StackTargetRefused extends RuntimeException
{
    public static function forTarget(StackTarget $target): self
    {
        return new self("This request may not change the stack of agent {$target->agentId}, session {$target->sessionId}.");
    }
}
