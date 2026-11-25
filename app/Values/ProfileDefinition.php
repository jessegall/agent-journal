<?php

declare(strict_types=1);

namespace App\Values;

use App\Data\Profiles\ProfileAuthorization;
use App\Enums\Profiles\InstancePolicy;
use App\Enums\Profiles\ModelTier;
use App\Support\Reflector;

/**
 * What an owner activates for one profile: its stable key, label and the content of its next revision, its start
 * policy included. A null skill allowlist means every applicable skill; an empty one means none.
 */
final readonly class ProfileDefinition
{
    /**
     * The properties differsFrom leaves out: they name the profile or record where it came from, not how it is set up.
     */
    private const array NOT_CONFIGURATION = [
        'key',
        'label',
        'description',
        'start.provenance',
        'start.requiresReview',
    ];

    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     */
    public function __construct(
        public ProfileKey $key,
        public string $label,
        public ProfileBase $base,
        public string $instructions,
        public ModelTier $preferredTier,
        public array|null $skillAllowlist,
        public array $requiredSkills,
        public ProfileStartPolicy $start,
        public ProfileAuthorization $authorization,
        public SupervisorRoutes $supervisor = new SupervisorRoutes(),
        public InstancePolicy $instances = InstancePolicy::Reusable,
        public string $description = '',
    ) {}

    /**
     * Whether this definition configures the profile differently from the revision it would follow: its key, label and
     * revision name it, and the provenance of its start policy and whether a start awaits review do not configure it.
     */
    public function differsFrom(ProfileSnapshot $active): bool
    {
        return ! Reflector::propertiesMatch($this, $active, self::NOT_CONFIGURATION);
    }

    public function supervisorProfile(): SupervisorProfile
    {
        return new SupervisorProfile($this->key, $this->supervisor, $this->authorization);
    }
}
