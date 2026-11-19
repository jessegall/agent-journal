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
    public function key(): string;

    public function name(): string;

    public function description(): string;

    public function condition(): SkillCondition;

    public function sections(): SkillSections;
}
