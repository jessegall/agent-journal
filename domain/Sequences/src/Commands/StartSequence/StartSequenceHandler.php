<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\StartSequence;

use App\Sessions\Contracts\SessionResolver;
use Domain\Sequences\Commands\Support\SequenceCommandHandler;
use Domain\Sequences\Models\SequenceRun;

/**
 * Resolves the session after every middleware, then starts the run for it under the run's row lock.
 */
final readonly class StartSequenceHandler extends SequenceCommandHandler
{
    public function __construct(
        private SessionResolver $sessions,
    ) {}

    public function handle(StartSequenceCommand $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        SequenceRun::findLockedById($command->sequenceRunId)->startFor($target->actorReference(), $target->sessionId);
    }
}
