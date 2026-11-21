<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\ProfileAdministrationPolicy;
use App\Profiles\Values\ProfileKey;

/**
 * The owner retires profiles: new starts can no longer choose them, while their keys and revisions stay readable.
 * The result is how many profiles were retired.
 *
 * @extends Command<int>
 */
#[Authorize(ProfileAdministrationPolicy::class, AccessType::Edit)]
final readonly class RevokeProfiles extends Command
{
    /**
     * @param  list<ProfileKey>  $keys
     */
    public function __construct(
        public array $keys,
    ) {}
}
