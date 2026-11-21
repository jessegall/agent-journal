<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\DraftExpectations;
use App\Profiles\Values\ProfileActivation;

/**
 * The owner activates a proposal: every profile in it is resolved and checked, and only when all pass does each
 * become its profile's next immutable revision, reaching only starts made after it.
 *
 * @extends Command<ProfileActivation>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Edit)]
final readonly class ActivateProfiles extends Command
{
    public function __construct(
        public ProfileProposal $proposal,
        public DraftExpectations $drafts = new DraftExpectations(),
    ) {}
}
