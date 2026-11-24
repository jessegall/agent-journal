<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * An agent's permission to take part in chats was withdrawn.
 */
final readonly class AgentChatPermissionWithdrawn extends MessageEvent
{
    public function __construct(
        public string $permissionId,
    ) {}
}
