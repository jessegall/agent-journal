<?php

declare(strict_types=1);

namespace App\Commands\Assignments\ClaimAutoAssignment;

use App\Attributes\Commands\Entry;
use App\Attributes\Commands\RepeatableRead;
use App\Enums\Accounts\CommandEntry;
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
