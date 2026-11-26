<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\AutoAssignerDefinition;
use App\Assignments\PoolDefinition;

/**
 * A domain that declares auto-assigners for its assignable types and pools to draw records from.
 */
interface AutoAssignmentProvider
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
