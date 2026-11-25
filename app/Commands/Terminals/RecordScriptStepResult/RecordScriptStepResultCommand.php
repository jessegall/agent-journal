<?php

declare(strict_types=1);

namespace App\Commands\Terminals\RecordScriptStepResult;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Terminals\StepStatus;
use App\Support\Command;

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
