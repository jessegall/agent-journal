<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\ProcessRunEvent;
use App\Support\ActorIdentity;

/**
 * A run its agent started has gone on past the wait a quick command takes, so the agent's chat shows it as a card.
 */
final readonly class ProcessRunOutlasted extends ProcessEvent implements ProcessRunEvent
{
    public function __construct(
        public string $processRunId,
        public ActorIdentity $runner,
    ) {}
}
