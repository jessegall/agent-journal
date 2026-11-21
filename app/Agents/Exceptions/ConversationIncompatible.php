<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartRefusalType;
use RuntimeException;

/**
 * A session that tried to enter a native conversation of another agent or another context; no visit is kept.
 */
final class ConversationIncompatible extends RuntimeException implements StartRefusal
{
    public static function forSession(string $sessionId): self
    {
        return new self(
            sprintf(
                'Session %s could not prepare its required journal context: the conversation it resumed belongs to other work. No journal work was admitted.',
                $sessionId,
            ),
        );
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ContextFailed;
    }
}
