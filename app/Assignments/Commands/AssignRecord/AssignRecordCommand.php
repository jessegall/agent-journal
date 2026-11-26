<?php

declare(strict_types=1);

namespace App\Assignments\Commands\AssignRecord;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\Effect;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Engine\Enums\CommandEffectType;
use App\Policies\AssignmentPolicy;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Gives one record to a holder, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AssignmentPolicy::class, AccessType::Create)]
final readonly class AssignRecordCommand extends Command
{
    public function __construct(
        public RecordIdentity $record,
        public AssigneeIdentity $recipient,
    ) {}
}
