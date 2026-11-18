<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\ProfileType;

/**
 * What an owner activates for one profile: its stable key, label and the content of its next revision. A null skill
 * allowlist means every applicable skill; an empty one means none.
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
        public ?array $skillAllowlist,
        public array $requiredSkills,
    ) {}
}
