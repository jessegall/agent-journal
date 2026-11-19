<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;

/**
 * What start preparation may rely on for each program the journal runs.
 */
interface ProgramCompatibilities
{
    public function for(HookProgram $program): ProgramCompatibility;
}
