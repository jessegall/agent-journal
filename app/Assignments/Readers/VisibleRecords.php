<?php

declare(strict_types=1);

namespace App\Assignments\Readers;

use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\RecordVisibility;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Records\Support\RecordIdentity;

/**
 * Asks the record type's own provider whether one record is visible to this request's actor, through its visibility
 * read only, never its assignment checks; a type nobody registered answers no, like a hidden record.
 */
final readonly class VisibleRecords implements RecordVisibility
{
    public function __construct(private AssignmentProviders $providers) {}

    public function isVisible(RecordIdentity $record): bool
    {
        try {
            $provider = $this->providers->recordProvider($record->type);
        } catch (AssignmentTypeUnavailable) {
            return false;
        }

        return in_array($record, $provider->visibleRecords([$record]));
    }
}
