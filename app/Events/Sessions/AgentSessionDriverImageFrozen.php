<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentSessionEvent;

/**
 * A session froze the driver image its starts and resumes run.
 */
final readonly class AgentSessionDriverImageFrozen implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $image,
    ) {}
}
