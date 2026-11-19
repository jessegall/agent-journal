<?php

declare(strict_types=1);

namespace App\Hooks\Resolvers;

use App\Hooks\Contracts\ProgramCompatibilities;
use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;

/**
 * The compatibility of each program's pinned build, as its account-free capture and native procedure recorded it.
 */
final readonly class PinnedCompatibilities implements ProgramCompatibilities
{
    public function for(HookProgram $program): ProgramCompatibility
    {
        return ProgramCompatibility::pinned($program);
    }
}
