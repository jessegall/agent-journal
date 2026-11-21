<?php

declare(strict_types=1);

namespace App\Hooks\Inspection\Contracts;

use App\Agents\Values\StackTarget;
use App\Hooks\Inspection\StackInspection;

/**
 * What other Core areas use of the Hooks area's StackInspectionQuery.
 */
interface StackInspectionQuery
{
    public function forTarget(StackTarget $target): StackInspection;
}
