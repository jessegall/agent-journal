<?php

declare(strict_types=1);

namespace App\Terminals\Commands\RecordScriptStepResult;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Terminals\Enums\StepStatus;

/**
 * A host reports how a step it ran or read for a profile run ended; the run records it once and resumes the same
 * suspended instruction. The host's own judgement of the step is the outcome, never an exit code a caller supplies.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordScriptStepResultCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $runId,
        public string $stepReference,
        public StepStatus $status,
        public string|null $port,
        public string|null $evidence,
    ) {}
}
