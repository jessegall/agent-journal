<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\UnassignRecordHandler;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;

/**
 * Releases one record from the holder the caller saw, in one repeatable-read transaction.
 *
 * @extends Command<AssignmentResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(UnassignRecordHandler::class)]
#[Authorize(AssignmentPolicy::class, AccessType::Edit)]
final readonly class UnassignRecord extends Command
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $expected,
    ) {}
}
