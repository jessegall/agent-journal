<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Enums\DriverVariant;
use App\Agents\Values\SelectedDriver;
use App\Agents\Values\StartPolicy;

/**
 * The profile a start is pinned to when its selection names none, and the policy it freezes: the agent's own, the
 * built-in ones installed first.
 */
interface BuiltInStartProfiles
{
    public function pin(SelectedDriver $selection, string $profileKey): SelectedDriver;

    /**
     * The policy a start of the profile freezes at its current revision, for a start that resolved no selection of
     * its own.
     */
    public function policyFor(string $profileKey): StartPolicy;

    /**
     * How a start of the profile runs when neither the launch nor the agent names a variant.
     */
    public function defaultVariantOf(string $profileKey): DriverVariant;
}
