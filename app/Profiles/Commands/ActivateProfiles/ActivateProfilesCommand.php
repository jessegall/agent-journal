<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ActivateProfiles;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileAdministrationPolicy;
use App\Profiles\ProfileProposal;
use App\Profiles\Values\DraftExpectations;
use App\Profiles\Values\ProfileActivation;
use App\Support\Command;

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
