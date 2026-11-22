<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\AssignmentProviders;
use App\Contracts\RecordVisibility;
use App\Support\RecordIdentity;

/**
 * Asks the record type's own provider whether one record is visible to this request's actor, through its visibility
 * read only, never its assignment checks; a type nobody registered answers no, like a hidden record.
 */
final readonly class VisibleRecords implements RecordVisibility
{
    public function __construct(private AssignmentProviders $providers) {}

    public function isVisible(RecordIdentity $record): bool
    {
        if (! $this->providers->hasRecordProvider($record->type)) {
            return false;
        }

        return in_array($record, $this->providers->recordProvider($record->type)->visibleRecords([$record]));
    }
}
