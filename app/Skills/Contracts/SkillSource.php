<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Support\StoredSkill;

/**
 * A source of skills that are not PHP classes, such as the skills users store.
 */
interface SkillSource
{
    /**
     * @return list<StoredSkill>
     */
    public function skills(): array;
}
