<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Resolvers\PinnedCompatibilities;
use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;
use Illuminate\Container\Attributes\Bind;

/**
 * What launch preparation may rely on for each program the journal runs.
 */
#[Bind(PinnedCompatibilities::class)]
interface ProgramCompatibilities
{
    public function for(HookProgram $program): ProgramCompatibility;
}
