<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Profiles\Handlers\RevokeProfilesHandler;
use App\Profiles\Values\ProfileKey;

/**
 * The owner retires profiles: new launches can no longer choose them, while their keys and revisions stay readable.
 * The result is how many profiles were retired.
 *
 * @implements Command<int>
 */
#[HandledBy(RevokeProfilesHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class RevokeProfiles implements Command
{
    /**
     * @param  list<ProfileKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}
}
