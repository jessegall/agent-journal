<?php

declare(strict_types=1);

namespace App\Assignments\Commands\ClaimAutoAssignment;

use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentOutcome;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * @extends Command<AutoAssignmentOutcome>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class ClaimAutoAssignmentCommand extends Command
{
    public function __construct(public AutoAssignmentKey $key) {}
}
