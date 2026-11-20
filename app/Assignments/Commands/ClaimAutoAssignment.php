<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\ClaimAutoAssignmentHandler;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentOutcome;
use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * @extends Command<AutoAssignmentOutcome>
 */
#[AllowsEngine]
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
#[HandledBy(ClaimAutoAssignmentHandler::class)]
final readonly class ClaimAutoAssignment extends Command
{
    public function __construct(public AutoAssignmentKey $key) {}
}
