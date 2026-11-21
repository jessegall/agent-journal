<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Values\SelectedDriver;

/**
 * The profile a start is pinned to when its selection names none: the agent's own, the built-in ones installed first.
 */
interface BuiltInStartProfiles
{
    public function pin(SelectedDriver $selection, string $profileKey): SelectedDriver;
}
