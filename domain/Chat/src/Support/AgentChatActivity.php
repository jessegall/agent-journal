<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use Carbon\CarbonImmutable;

/**
 * What the chat list shows of one agent beside its status: whether it is a main agent, how many of its messages the
 * viewer has not read, when its chat with the viewer last moved, and whether a question of it waits for the viewer.
 */
final readonly class AgentChatActivity
{
    public function __construct(
        public bool $isMain,
        public int $unreadCount,
        // The newest entry of its chat with the viewer; none while that chat holds nothing.
        public CarbonImmutable|null $lastActiveAt,
        public bool $waitsOnYou,
    ) {}
}
