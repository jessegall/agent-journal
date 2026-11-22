<?php

declare(strict_types=1);

namespace App\Commands\AssignRecord;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
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
