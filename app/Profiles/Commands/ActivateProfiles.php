<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Handlers\ActivateProfilesHandler;
use App\Profiles\Models\Profile;
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
#[HandledBy(ActivateProfilesHandler::class)]
#[Authorize(ProfileAdministrationPolicy::class, ProfileAbility::Administer)]
#[Operation('activate_profiles', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class ActivateProfiles extends Command implements AuthorizedCommand
{
    public function __construct(
        public ProfileProposal $proposal,
        public DraftExpectations $drafts = new DraftExpectations(),
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Profile::class;
    }
}
