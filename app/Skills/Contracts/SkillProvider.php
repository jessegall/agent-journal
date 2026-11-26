<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

/**
 * A domain or module that supplies skills: it lists their classes, and each class is one skill.
 */
interface SkillProvider
{
    /**
     * @return list<class-string<Skill>>
     */
    public function skills(): array;
}
