<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

/**
 * One agent of the chat list in its place: its chat with the viewer, when they have one, and when that chat last
 * moved, as the database wrote the time, so the next page starts exactly after it.
 */
final readonly class RankedAgent
{
    public function __construct(
        public string $agentId,
        public string|null $inboxId,
        public string|null $lastActiveAt,
    ) {}
}
