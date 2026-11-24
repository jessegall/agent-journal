<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Exceptions\ConversationIncompatible;
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

    /**
     * Notes that the session's context was compacted at the event, so what the agent saw is read again.
     */
    public function compacted(string $sessionId, string $eventId, CarbonImmutable $observedAt): void;
}
