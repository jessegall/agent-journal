<?php

declare(strict_types=1);

namespace App\Commands\Profiles\ActivateProfiles;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProfileAdministrationPolicy;
use App\Support\Command;
use App\Support\ProfileProposal;
use App\Values\DraftExpectations;
use App\Values\ProfileActivation;

/**
 * The owner activates a proposal: every profile in it is resolved and checked, and only when all pass does each
 * become its profile's next immutable revision, reaching only starts made after it.
 *
 * @extends Command<ProfileActivation>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Edit)]
final readonly class ActivateProfilesCommand extends Command
{
    public function __construct(
        public ProfileProposal $proposal,
        public DraftExpectations $drafts = new DraftExpectations(),
    ) {}
}
