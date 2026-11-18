<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * One skill of the catalogue as readers see it: key, name, owner, description and rendered text.
 */
final readonly class SkillEntry
{
    public function __construct(
        public SkillKey $key,
        public string $name,
        public string $owner,
        public string $description,
        public RenderedSkill $rendered,
    ) {}
}
