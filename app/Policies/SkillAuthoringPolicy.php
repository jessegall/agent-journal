<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\OwnerPolicy;
use App\Models\Skills\Skill;

/**
 * Who may administer the stored skills: only the owner holds the access, so the grants decide.
 */
final readonly class SkillAuthoringPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Skill::class;
    }
}
