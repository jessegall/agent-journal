<?php

declare(strict_types=1);

namespace App\Assignments\Commands\AssignRecordForMaintenance;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Effect;
use App\Attributes\Commands\Entry;
use App\Attributes\Commands\RepeatableRead;
use App\Engine\Enums\CommandEffectType;
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
