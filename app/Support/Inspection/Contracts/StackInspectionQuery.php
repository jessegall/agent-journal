<?php

declare(strict_types=1);

namespace App\Support\Inspection\Contracts;

use App\Support\Inspection\StackInspection;
use App\Values\StackTarget;

/**
 * What other Core areas use of the Hooks area's StackInspectionQuery.
 */
interface StackInspectionQuery
{
    /**
     * The stack of the target as the inspector shows it.
     */
    public function forTarget(StackTarget $target): StackInspection;
}
