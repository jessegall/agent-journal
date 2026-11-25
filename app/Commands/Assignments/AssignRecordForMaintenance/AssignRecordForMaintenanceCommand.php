<?php

declare(strict_types=1);

namespace App\Commands\Assignments\AssignRecordForMaintenance;

use App\Attributes\Effect;
use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Reviews\CommandEffectType;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
#[Effect(CommandEffectType::AssignmentChange)]
final readonly class AssignRecordForMaintenanceCommand extends Command
{
    public const string FILL_SCOPE = 'assignments.fill';

    public function __construct(public RecordIdentity $record, public AssigneeIdentity $recipient) {}
}
