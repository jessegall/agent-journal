<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Profiles\Handlers\ActivateProfilesHandler;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\ProfileActivation;

/**
 * The owner activates a proposal: every profile in it is resolved and checked, and only when all pass does each
 * become its profile's next immutable revision, reaching only launches that start after it.
 *
 * @implements Command<ProfileActivation>
 */
#[HandledBy(ActivateProfilesHandler::class)]
final readonly class ActivateProfiles implements Command
{
    public function __construct(
        public ProfileProposal $proposal,
    ) {}
}
