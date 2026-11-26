<?php

declare(strict_types=1);

namespace App\Assignments\Commands\ClaimAutoAssignment;

use App\Accounts\Enums\CommandEntry;
use App\Assignments\AutoAssignmentOutcome;
use App\Attributes\Commands\Entry;
use App\Attributes\Commands\RepeatableRead;
use App\Support\AutoAssignmentKey;
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
