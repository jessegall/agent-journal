<?php

declare(strict_types=1);

namespace App\Support;

final readonly class JournalAssignment
{
    public function __construct(
        public RecordIdentity $record,
        public AssigneeIdentity $recipient,
        public int $expectedVersion,
    ) {}
}
