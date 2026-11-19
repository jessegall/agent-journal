<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Records\Support\RecordIdentity;

/**
 * The one current holder of a record, with the reference a later change must name.
 */
final readonly class Assignment
{
    public function __construct(
        public RecordIdentity $record,
        public AssignmentReference $reference,
    ) {}

    public function holder(): AssigneeIdentity
    {
        return $this->reference->holder;
    }

    public function isFor(RecordIdentity $record): bool
    {
        return $this->record->isSameAs($record);
    }
}
