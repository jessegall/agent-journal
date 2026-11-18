<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Enums\SkillOrigin;

/**
 * One skill of the catalogue as readers see it: key, name, owner, whether it is shipped or stored, description, its
 * checked condition, its current revision (stored skills only; a shipped skill has none) and rendered text.
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
        public ?int $revision,
        public RenderedSkill $rendered,
    ) {}

    /**
     * This skill's rendered text as the draft of a copy: one section holding the text below its title, with the same
     * name, description and condition. The copy is a snapshot of these bytes.
     */
    public function copyDraft(): SkillDraft
    {
        $body = (string) preg_replace('/\A---\n.*?\n---\n\n# [^\n]*\n\n/s', '', $this->rendered->markdown, 1);

        return new SkillDraft($this->name, $this->description, [new SectionDraft('copied', $this->name, rtrim($body, "\n"))], json_encode($this->condition->toArray(), JSON_THROW_ON_ERROR));
    }
}
