<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\Actors\Actor;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\RecordSettlement;
use Domain\Documents\Models\Report;

/**
 * Settles a document or a report for a reason and keeps the settlement in its history, once: the same reason again
 * changes nothing. Who may settle is decided before.
 */
final readonly class RecordSettling
{
    public function settle(Document|Report $record, Actor $actor, string $reason, int|null $revisionNumber): bool
    {
        $trimmed = trim($reason);

        if (! $record->settle($trimmed)) {
            return false;
        }

        RecordSettlement::create($record::LINK_TYPE, $record->id, $actor, $trimmed, $revisionNumber);

        return true;
    }
}
