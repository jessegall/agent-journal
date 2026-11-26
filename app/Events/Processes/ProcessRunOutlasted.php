<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\ProcessRunEvent;
use App\Support\ActorReference;

/**
 * A run its agent started has gone on past the wait a quick command takes, so the agent's conversation shows it as a card.
 */
final readonly class ProcessRunOutlasted implements ProcessEvent, ProcessRunEvent
{
    public function __construct(
        public string $processRunId,
        public ActorReference $runner,
    ) {}
}
