<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Sequences\Handlers\StartSequenceHandler;
use Domain\Sequences\Policies\SequencePolicy;

/**
 * Starts an existing sequence run for the agent of a session; the start and its state commit together.
 *
 * @extends Command<null>
 */
#[HandledBy(StartSequenceHandler::class)]
#[Authorize(SequencePolicy::class, AccessType::Create)]
final readonly class StartSequence extends Command
{
    public function __construct(
        public string $sequenceRunId,
        public string $sessionId,
    ) {}
}
