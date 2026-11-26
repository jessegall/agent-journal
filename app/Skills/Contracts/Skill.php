<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\SkillSections;

/**
 * One skill: a stable key, a name, a short description, the condition that decides who receives it, and its sections,
 * listed by hand or read from the headings of its file.
 */
interface Skill
{
    /**
     * The key the skill is found and loaded by.
     */
    public function key(): string;

    /**
     * The name an agent sees for the skill.
     */
    public function name(): string;

    /**
     * The line that tells an agent when to load the skill.
     */
    public function description(): string;

    /**
     * When the skill is offered to an agent.
     */
    public function condition(): SkillCondition;

    /**
     * The text of the skill, in its sections.
     */
    public function sections(): SkillSections;
}
