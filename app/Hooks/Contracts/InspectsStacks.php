<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Inspection\StackInspection;

/**
 * What other Core areas use of the Hooks area's StackInspectionQuery.
 */
interface InspectsStacks
{
    public function forTarget(StackTarget $target): StackInspection;
}
