<?php

declare(strict_types=1);

namespace Domain\Sequences\Handlers;

use App\Agents\Contracts\SessionReader;
use App\Contracts\CommandHandler;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Models\SequenceRun;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then starts the run for it under the run's row lock.
 */
final readonly class StartSequenceHandler implements CommandHandler
{
    public function __construct(
        private SessionReader $sessions,
        private Dispatcher $events,
    ) {}

    public function handle(StartSequence $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        SequenceRun::lockedById($command->sequenceRunId)->startFor($target);
        $this->events->dispatch(new SequenceStarted($command->sequenceRunId, $target));
    }
}
