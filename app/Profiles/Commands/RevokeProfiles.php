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
use App\Profiles\Handlers\RevokeProfilesHandler;
use App\Profiles\Models\Profile;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;

/**
 * The owner retires profiles: new starts can no longer choose them, while their keys and revisions stay readable.
 * The result is how many profiles were retired.
 *
 * @extends Command<int>
 */
#[HandledBy(RevokeProfilesHandler::class)]
#[Authorize(ProfileAdministrationPolicy::class, ProfileAbility::Administer)]
#[Operation('revoke_profiles', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class RevokeProfiles extends Command implements AuthorizedCommand
{
    /**
     * @param  list<ProfileKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Profile::class;
    }
}
