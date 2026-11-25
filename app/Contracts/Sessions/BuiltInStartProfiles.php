<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Enums\Drivers\DriverType;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;

/**
 * The profile a start is pinned to when its selection names none, and the policy it freezes: the agent's own, the
 * built-in ones installed first.
 */
interface BuiltInStartProfiles
{
    /**
     * The driver selection with the built-in profile of that key pinned to it.
     */
    public function pin(SelectedDriver $selection, string $profileKey): SelectedDriver;

    /**
     * The policy a start of the profile freezes at its current revision, for a start that resolved no selection of
     * its own.
     */
    public function policyFor(string $profileKey): StartPolicy;

    /**
     * How a start of the profile runs when neither the launch nor the agent names a driver type.
     */
    public function defaultDriverTypeOf(string $profileKey): DriverType;
}
