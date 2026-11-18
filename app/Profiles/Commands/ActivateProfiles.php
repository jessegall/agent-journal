<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Profiles\Handlers\ActivateProfilesHandler;
use App\Profiles\Values\ProfileActivation;
use App\Profiles\Values\ProfileDefinition;

/**
 * The owner activates profiles: each definition becomes its profile's next immutable revision, under the identity its
 * key already has, and reaches only launches that start after it.
 *
 * @implements Command<ProfileActivation>
 */
#[HandledBy(ActivateProfilesHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class ActivateProfiles implements Command
{
    /**
     * @param  list<ProfileDefinition>  $profiles
     */
    public function __construct(
        public array $profiles,
    ) {}
}
