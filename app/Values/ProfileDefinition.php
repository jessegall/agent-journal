<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\InstancePolicy;

/**
 * What an owner activates for one profile: its stable key, label and the content of its next revision, its start
 * policy included. A null skill allowlist means every applicable skill; an empty one means none.
 */
final readonly class ProfileDefinition
{
    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     */
    public function __construct(
        public ProfileKey $key,
        public string $label,
        public ProfileBase $base,
        public string $instructions,
        public string $model,
        public array|null $skillAllowlist,
        public array $requiredSkills,
        public ProfileStartPolicy $start,
        public ProfileAuthorization $authorization,
        public SupervisorRoutes $supervisor = new SupervisorRoutes(),
        public InstancePolicy $instances = InstancePolicy::Reusable,
    ) {}

    /**
     * Whether this definition configures the profile differently from the revision it would follow; the hash and
     * origins of its provenance do not count.
     */
    public function differsFrom(ProfileSnapshot $active): bool
    {
        $mine = $this->start;
        $theirs = $active->start;

        return ! $this->base->is($active->base)
            || $this->instructions !== $active->instructions
            || $this->model !== $active->model
            || $this->skillAllowlist !== $active->skillAllowlist
            || $this->requiredSkills !== $active->requiredSkills
            || $mine->driver !== $theirs->driver
            || $mine->driverPinned !== $theirs->driverPinned
            || $mine->allowedModels !== $theirs->allowedModels
            || $mine->access != $theirs->access
            || $mine->stopConditions != $theirs->stopConditions
            || $mine->execution != $theirs->execution
            || $this->authorization != $active->authorization
            || $this->supervisor != $active->supervisor
            || $this->instances !== $active->instances;
    }

    public function supervisorProfile(): SupervisorProfile
    {
        return new SupervisorProfile($this->key, $this->supervisor, $this->authorization);
    }
}
