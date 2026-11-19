<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\ProfileType;

/**
 * What an owner activates for one profile: its stable key, label and the content of its next revision, its launch
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
        public ProfileType $type,
        public string $instructions,
        public string $model,
        public array|null $skillAllowlist,
        public array $requiredSkills,
        public ProfileLaunchPolicy $launch,
        public ProfileAuthorization $authorization,
    ) {}

    /**
     * Whether this definition configures the profile differently from the revision it would follow; the hash and
     * origins of its provenance do not count.
     */
    public function differsFrom(ProfileSnapshot $active): bool
    {
        $mine = $this->launch;
        $theirs = $active->launch;

        return $this->type !== $active->type
            || $this->instructions !== $active->instructions
            || $this->model !== $active->model
            || $this->skillAllowlist !== $active->skillAllowlist
            || $this->requiredSkills !== $active->requiredSkills
            || $mine->program !== $theirs->program
            || $mine->programPinned !== $theirs->programPinned
            || $mine->allowedModels !== $theirs->allowedModels
            || $mine->access != $theirs->access
            || $mine->stopConditions != $theirs->stopConditions
            || $mine->execution != $theirs->execution
            || $this->authorization != $active->authorization;
    }
}
