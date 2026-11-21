<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Values\SelectedProgram;

/**
 * The profile a start is pinned to when its selection names none: the agent's own, the built-in ones installed first.
 */
interface BuiltInStartProfiles
{
    public function pin(SelectedProgram $selection, string $profileKey): SelectedProgram;
}
