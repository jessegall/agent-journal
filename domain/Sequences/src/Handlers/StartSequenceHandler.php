<?php

declare(strict_types=1);

namespace Domain\Sequences\Handlers;

use App\Agents\Contracts\SessionResolver;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Handlers\Support\SequenceCommandHandler;
use Domain\Sequences\Models\SequenceRun;

/**
 * Resolves the session after every middleware, then starts the run for it under the run's row lock.
 */
final readonly class StartSequenceHandler extends SequenceCommandHandler
{
    public function __construct(
        private SessionResolver $sessions,
    ) {}

    public function handle(StartSequence $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        SequenceRun::lockedById($command->sequenceRunId)->startFor($target->actorIdentity(), $target->sessionId);
    }
}
