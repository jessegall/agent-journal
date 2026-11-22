<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\ConversationIncompatible;
use Carbon\CarbonImmutable;

/**
 * Records an agent's visits to its driver conversation: when a session enters it, with the transcript path the host
 * named for it, and when it is compacted.
 */
interface ConversationVisits
{
    /**
     * @throws ConversationIncompatible
     */
    public function entered(
        string $sessionId,
        string $nativeId,
        string|null $transcriptPath,
        string $eventId,
        CarbonImmutable $observedAt,
    ): void;

    public function compacted(string $sessionId, string $eventId, CarbonImmutable $observedAt): void;
}
