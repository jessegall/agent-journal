<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Drivers\Enums\HookDriver;
use Carbon\CarbonImmutable;

/**
 * A conversation of an agent that an explicit resume may continue, by its journal id.
 */
final readonly class ResumableConversation
{
    public function __construct(
        public string $conversationId,
        public HookDriver $driver,
        public CarbonImmutable $startedAt,
    ) {}
}
