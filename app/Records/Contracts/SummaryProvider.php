<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Exceptions\RecordUnavailable;
use App\Records\Values\RecordSummary;
use App\Values\ProjectOwner;

/**
 * Reads the summaries of one record type for the current actor: one record's, refused alike when it is missing or
 * unreadable, and those of a batch in one read.
 */
interface SummaryProvider
{
    /**
     * The summary of the record, when the actor may read it.
     *
     * @throws RecordUnavailable
     */
    public function requireReadable(string $id): RecordSummary;

    /**
     * The project the record belongs to, or Global.
     *
     * @throws RecordUnavailable
     */
    public function ownerOf(string $id): ProjectOwner;

    /**
     * The summary of each record the actor may read, in one read; one it may not read has none.
     *
     * @param  list<string>  $ids
     * @return list<RecordSummary>
     */
    public function visibleSummaries(array $ids): array;
}
