<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The skills selected for one context, those left out with their reasons, and a digest that changes when the selected
 * keys, their texts or the context's identity change.
 */
final readonly class SelectedSkills
{
    /**
     * @param  list<SkillEntry>  $selected
     * @param  list<ExcludedSkill>  $excluded
     */
    public function __construct(
        public array $selected,
        public array $excluded,
        public string $digest,
    ) {}

    /**
     * @return list<string>
     */
    public function selectedKeys(): array
    {
        return array_map(fn (SkillEntry $skill) => $skill->key->key, $this->selected);
    }
}
