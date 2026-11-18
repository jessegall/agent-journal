<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Models\Profile;
use App\Profiles\Values\ActivatedProfile;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileDefinition;

final readonly class ActivateProfilesHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
    ) {}

    public function handle(ActivateProfiles $command): ProfileActivation
    {
        $author = ActorIdentity::of($this->actors->actor());

        return new ProfileActivation(array_map(
            fn (ProfileDefinition $definition) => new ActivatedProfile($definition->key, Profile::activate($definition, $author)->revision),
            $command->profiles,
        ));
    }
}
