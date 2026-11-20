<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Sequences\Enums\SequenceAbility;
use Domain\Sequences\Handlers\StartSequenceHandler;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Policies\SequencePolicy;

/**
 * Starts an existing sequence run for the agent of a session; the start and its state commit together.
 *
 * @extends Command<null>
 */
#[HandledBy(StartSequenceHandler::class)]
#[Authorize(SequencePolicy::class, SequenceAbility::Work)]
#[Operation('start_sequence', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class StartSequence extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $sequenceRunId,
        public string $sessionId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return SequenceRun::class;
    }
}
