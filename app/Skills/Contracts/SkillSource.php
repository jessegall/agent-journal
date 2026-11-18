<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

/**
 * A source of skills that are not PHP classes, such as the skills users store.
 */
interface SkillSource
{
    /**
     * @return list<Skill>
     */
    public function skills(): array;
}
