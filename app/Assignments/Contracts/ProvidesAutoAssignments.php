<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;

/**
 * A domain that declares auto-assigners for its assignable types and pools to draw records from.
 */
interface ProvidesAutoAssignments
{
    /**
     * @return list<AutoAssignerDefinition>
     */
    public function autoAssigners(): array;

    /**
     * @return list<PoolDefinition>
     */
    public function assignmentPools(): array;
}
