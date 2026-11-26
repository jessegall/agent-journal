<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\AdvanceSequence;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Sequences\Policies\SequencePolicy;

/**
 * Ends the step a run is on and moves it to the next, or finishes the run after its last step.
 *
 * @extends Command<null>
 */
#[Authorize(SequencePolicy::class, AccessType::Edit)]
final readonly class AdvanceSequenceCommand extends Command
{
    public function __construct(
        public string $sequenceRunId,
    ) {}
}
