<?php

declare(strict_types=1);

namespace App\Assignments\Commands;

use App\Assignments\Handlers\UnassignRecordHandler;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Contracts\Command;
use App\Records\Support\RecordIdentity;

/**
 * Releases one record from the holder the caller saw, in one repeatable-read transaction.
 *
 * @implements Command<AssignmentResult>
 */
#[HandledBy(UnassignRecordHandler::class)]
#[RepeatableRead]
final readonly class UnassignRecord implements Command
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $expected,
    ) {}
}
