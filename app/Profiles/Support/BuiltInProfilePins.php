<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Support\ActorStore;
use App\Agents\Contracts\BuiltInLaunchProfiles;
use App\Agents\Enums\AgentRole;
use App\Agents\Support\SelectedProgram;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\InstallBuiltInProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileSnapshot;

/**
 * The built-in profile a launch without a profile of its own is pinned to, activated with the project's proposal the
 * first time one is needed; activation is idempotent, so an unchanged definition adds no revision.
 */
final readonly class BuiltInProfilePins implements BuiltInLaunchProfiles
{
    public function __construct(
        private ProfileResolver $profiles,
        private CommandBus $commands,
        private ActorStore $actors,
    ) {}

    public function snapshotFor(ProfileType $type): ProfileSnapshot
    {
        $key = BuiltInProfiles::keyFor($type);

        if (! $this->profiles->has($key)) {
            $this->actors->actAsSystem('built-in profiles', fn (): mixed => $this->commands->run(new InstallBuiltInProfiles()));
        }

        return $this->profiles->snapshotFor($key);
    }

    public function pin(SelectedProgram $selection, AgentRole $role): SelectedProgram
    {
        if ($selection->source->profileKey !== null) {
            return $selection;
        }

        $builtIn = $this->snapshotFor(ProfileType::forRole($role));

        return $selection->pinnedTo($builtIn->key->key, $builtIn->revision);
    }
}
