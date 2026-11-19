<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Enums\AgentRole;
use App\Agents\Support\SelectedProgram;

/**
 * The built-in profile a launch of a role is pinned to when its selection names no profile of its own.
 */
interface BuiltInLaunchProfiles
{
    public function pin(SelectedProgram $selection, AgentRole $role): SelectedProgram;
}
