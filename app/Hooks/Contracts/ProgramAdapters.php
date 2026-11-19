<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Programs\Enums\HookProgram;

/**
 * The adapter that reads and answers each supported program's hook calls.
 */
interface ProgramAdapters
{
    public function for(HookProgram $program): ProgramAdapter;
}
