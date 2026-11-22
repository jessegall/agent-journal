<?php

declare(strict_types=1);

namespace App\Commands\ClaimAutoAssignment;

use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Enums\CommandEntry;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentOutcome;
use App\Support\Command;

/**
 * @extends Command<AutoAssignmentOutcome>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class ClaimAutoAssignmentCommand extends Command
{
    public function __construct(public AutoAssignmentKey $key) {}
}
