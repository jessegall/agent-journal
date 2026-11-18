<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\SkillSection;

/**
 * One skill: a stable key, a name, a short description, the condition that decides who receives it, and its sections
 * in the order they are written.
 */
interface Skill
{
    public function key(): string;

    public function name(): string;

    public function description(): string;

    public function condition(): SkillCondition;

    /**
     * @return list<SkillSection>
     */
    public function sections(): array;
}
