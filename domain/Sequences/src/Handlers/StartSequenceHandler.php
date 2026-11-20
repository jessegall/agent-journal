<?php

declare(strict_types=1);

namespace Domain\Sequences\Handlers;

use App\Agents\Contracts\SessionResolver;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Handlers\Support\SequenceCommandHandler;
use Domain\Sequences\Models\SequenceRun;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then starts the run for it under the run's row lock.
 */
final readonly class StartSequenceHandler extends SequenceCommandHandler
{
    public function __construct(
        private SessionResolver $sessions,
        private Dispatcher $events,
    ) {}

    public function handle(StartSequence $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        SequenceRun::lockedById($command->sequenceRunId)->startFor($target->actorIdentity());
        $this->events->dispatch(new SequenceStarted($command->sequenceRunId, $target));
    }
}
