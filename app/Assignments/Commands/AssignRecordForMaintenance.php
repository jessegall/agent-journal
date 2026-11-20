<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\AssignRecordForMaintenanceHandler;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;

/** @extends Command<AssignmentResult> */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
#[HandledBy(AssignRecordForMaintenanceHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
final readonly class AssignRecordForMaintenance extends Command
{
    public const string FILL_SCOPE = 'assignments.fill';

    public function __construct(public RecordIdentity $record, public AssigneeIdentity $recipient) {}
}
