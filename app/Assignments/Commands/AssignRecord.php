<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Handlers\AssignRecordHandler;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;
use App\Records\Support\RecordIdentity;

/**
 * Gives one record to a holder, in one repeatable-read transaction.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(AssignRecordHandler::class)]
#[RepeatableRead]
final readonly class AssignRecord implements Command
{
    public function __construct(
        public RecordIdentity $record,
        public ActorIdentity $recipient,
    ) {}
}
