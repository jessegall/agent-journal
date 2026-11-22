<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AutoAssignerDefinition;
use App\Support\PoolDefinition;

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
