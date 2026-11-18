<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Enums\SkillOrigin;

/**
 * One skill of the catalogue as readers see it: key, name, owner, whether it is shipped or stored, description, its
 * checked condition and rendered text.
 */
final readonly class SkillEntry
{
    public function __construct(
        public SkillKey $key,
        public string $name,
        public string $owner,
        public SkillOrigin $origin,
        public string $description,
        public SkillCondition $condition,
        public RenderedSkill $rendered,
    ) {}
}
