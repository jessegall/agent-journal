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
    public function forTarget(StackTarget $target): StackInspection;
}
