<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\AssignRecordHandler;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;

/**
 * Gives one record to a holder, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(AssignRecordHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AssignmentPolicy::class, AccessType::Create)]
final readonly class AssignRecord extends Command
{
    public function __construct(
        public RecordIdentity $record,
        public AssigneeIdentity $recipient,
    ) {}
}
