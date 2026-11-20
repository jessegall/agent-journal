<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Handlers\AssignRecordHandler;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;

/**
 * Gives one record to a holder, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[HandledBy(AssignRecordHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Operation('assign_record', ResourceAreaType::JournalWork, AccessType::Create)]
#[Authorize(AssignmentPolicy::class, AssignmentAbility::Work)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class AssignRecord extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $record,
        public AssigneeIdentity $recipient,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return AssignmentRecord::class;
    }
}
