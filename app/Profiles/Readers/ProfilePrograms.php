<?php

declare(strict_types=1);

namespace App\Profiles\Readers;

use App\Agents\Support\ModelSelection;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\SelectedProgram;
use App\Profiles\Contracts\ProfileReader;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSelection;

/**
 * Selects the program and model of a launch from the profile's current revision through Core's SelectedProgram,
 * which records the profile key and revision as the selection's source.
 */
final readonly class ProfilePrograms implements ProfileSelections
{
    public function __construct(private ProfileReader $profiles) {}

    public function select(
        ProfileKey $profile,
        ModelSelection $requested,
        string|null $programKey,
        string|null $parentProgram,
    ): ProfileSelection {
        $snapshot = $this->profiles->snapshotFor($profile);
        $launch = $snapshot->launch;
        $defaults = new ProfileDefaults(
            $profile->key,
            $snapshot->revision,
            $launch->program,
            $launch->programPinned,
            $snapshot->model,
            $launch->allowedModels,
        );

        return new ProfileSelection(
            SelectedProgram::resolve($programKey, $requested, $defaults, $parentProgram),
            $snapshot->type,
            $snapshot->type->agentRole(),
            $launch,
        );
    }
}
