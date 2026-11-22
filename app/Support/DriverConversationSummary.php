<?php

declare(strict_types=1);

namespace App\Support;

use Carbon\CarbonImmutable;

/**
 * One native conversation an agent may continue: its id, the model its last visit ran on and when that was.
 */
final readonly class DriverConversationSummary
{
    public function __construct(
        public string $conversationId,
        public string $nativeId,
        public string|null $contextReference,
        public string $lastModel,
        public CarbonImmutable $lastVisitedAt,
    ) {}
}
