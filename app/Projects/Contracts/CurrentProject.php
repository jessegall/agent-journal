<?php

declare(strict_types=1);

namespace App\Projects\Contracts;

use App\Values\ProjectSelection;

/**
 * The projects this request reads, answered from who acts.
 */
interface CurrentProject
{
    /**
     * The selection every project-owned read is filtered by now.
     */
    public function selection(): ProjectSelection;
}
