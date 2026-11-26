<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RevokeProfiles;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProfileAdministrationPolicy;
use App\Support\Command;
use App\Values\ProfileKey;

/**
 * The owner retires profiles: new starts can no longer choose them, while their keys and revisions stay readable.
 * The result is how many profiles were retired.
 *
 * @extends Command<int>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Edit)]
final readonly class RevokeProfilesCommand extends Command
{
    /**
     * @param  list<ProfileKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}
}
