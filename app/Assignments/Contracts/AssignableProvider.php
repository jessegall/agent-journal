<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Records\Support\RecordIdentity;

/**
 * What the owner of one record type answers for assignments: the record itself inside a command, which records the
 * caller may see, and which are finished. Each owner domain supplies one per type it declares.
 */
interface AssignableProvider
{
    /**
     * The visible, permitted record, read under a key-share lock inside the writer's transaction.
     */
    public function requireAssignable(RecordIdentity $record): Assignable;

    /**
     * The visible ones of at most 100 records, in the order given; a hidden or missing record is left out without
     * saying
     * why.
     *
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array;

    /**
     * The records whose work is finished at the transaction's snapshot.
     *
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array;
}
