<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AssigneeIdentity;
use Illuminate\Database\Query\Builder;

/**
 * Fresh subqueries of assigned record ids, for a domain query to filter by with whereIn or whereNotIn.
 */
interface AssignmentQuery
{
    /**
     * The ids of the records of the type the holder holds.
     */
    public function heldIds(string $type, AssigneeIdentity $holder): Builder;

    /**
     * The ids of the records of the type anyone holds.
     */
    public function assignedIds(string $type): Builder;
}
