<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A session that tried to enter a native conversation of another agent or another context; no visit is kept.
 */
final class ConversationIncompatible extends RuntimeException implements CommandRefusal
{
    public static function forSession(string $sessionId): self
    {
        return new self(
            "Session {$sessionId} could not prepare its required journal context: the conversation it resumed belongs to other work. No journal work was admitted.",
        );
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::ContextFailed;
    }
}
