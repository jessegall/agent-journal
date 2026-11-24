<?php

declare(strict_types=1);

namespace App\Contracts\Search;

use App\Support\ActorContext;
use App\Values\AdmittedConstraints;
use App\Values\OpenAction;
use App\Values\ReadRequest;
use App\Values\RecordLocation;
use App\Values\SearchReader;

/**
 * Who may search one source and what they may see of it: the read an agent needs, whether a signed-in user may
 * search it, and the record ids, views, fields and passages the reader's grant admits.
 */
interface SearchAccess
{
    /**
     * The read an agent's grant must allow for the source to be eligible, such as tasks_read.
     */
    public function agentRead(): ReadRequest;

    /**
     * Whether the user may search this source.
     */
    public function canUserSearch(ActorContext $user): bool;

    /**
     * What the reader's grant admits, compiled once for a batch from the real principal.
     */
    public function constraints(SearchReader $reader): AdmittedConstraints;

    /**
     * Whether the reader may run the open action of this record now: the same argument-specific decision the
     * owner's read makes, asked before a hit is emitted and again when it is opened.
     */
    public function admitsOpen(SearchReader $reader, string $recordId): bool;

    /**
     * The read that opens this record, or the passage at this location, such as tasks_read with its task_id.
     */
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction;

    /**
     * The query the record's page takes to open at this location, such as tab=logs and the line; none for the
     * record itself.
     *
     * @return array<string, string>
     */
    public function pageQuery(RecordLocation|null $location): array;
}
