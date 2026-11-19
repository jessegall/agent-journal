<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\SelectedProgram;

/**
 * The profile a launch is pinned to when its selection names none: the agent's own, the built-in ones installed first.
 */
interface BuiltInLaunchProfiles
{
    public function pin(SelectedProgram $selection, string $profileKey): SelectedProgram;
}
