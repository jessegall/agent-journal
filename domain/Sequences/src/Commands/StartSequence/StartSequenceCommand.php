<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\StartSequence;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Sequences\Policies\SequencePolicy;

/**
 * Starts an existing sequence run for the agent of a session; the start and its state commit together.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Authorize(SequencePolicy::class, AccessType::Create)]
final readonly class StartSequenceCommand extends Command
{
    public function __construct(
        public string $sequenceRunId,
        public string $sessionId,
    ) {}
}
