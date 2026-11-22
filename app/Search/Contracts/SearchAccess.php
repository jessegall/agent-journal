<?php

declare(strict_types=1);

namespace App\Search\Contracts;

use App\Actors\Support\ActorContext;
use App\Agents\Values\ReadRequest;
use App\Search\Values\AdmittedConstraints;
use App\Search\Values\SearchReader;

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

    public function canUserSearch(ActorContext $user): bool;

    /**
     * What the reader's grant admits, compiled once for a batch from the real principal.
     */
    public function constraints(SearchReader $reader): AdmittedConstraints;
}
