<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Profiles\Enums\ProfileAbility;
use App\Profiles\Handlers\ActivateProfilesHandler;
use App\Profiles\Models\Profile;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Values\ProfileActivation;

/**
 * The owner activates a proposal: every profile in it is resolved and checked, and only when all pass does each
 * become its profile's next immutable revision, reaching only starts made after it.
 *
 * @extends Command<ProfileActivation>
 */
#[HandledBy(ActivateProfilesHandler::class)]
#[Operation('activate_profiles', ResourceAreaType::JournalControl, AccessType::Edit)]
#[Authorize(ProfileAdministrationPolicy::class, ProfileAbility::Administer)]
final readonly class ActivateProfiles extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public ProfileProposal $proposal,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Profile::class;
    }
}
