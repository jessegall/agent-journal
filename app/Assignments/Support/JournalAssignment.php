<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Records\Support\RecordIdentity;

final readonly class JournalAssignment
{
    public function __construct(
        public RecordIdentity $record,
        public AssigneeIdentity $recipient,
        public int $expectedVersion,
    ) {}
}
