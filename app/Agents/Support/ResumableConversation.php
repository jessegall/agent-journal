<?php

declare(strict_types=1);

namespace App\Agents\Support;

use Carbon\CarbonImmutable;

/**
 * A conversation of an agent that an explicit resume may continue, by its journal id.
 */
final readonly class ResumableConversation
{
    public function __construct(
        public string $conversationId,
        public string $driver,
        public CarbonImmutable $startedAt,
    ) {}
}
