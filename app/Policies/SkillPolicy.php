<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\Policy;
use App\Models\Skills\Skill;

/**
 * Who may act on Skill records; the grant decides, and the handlers keep their own checks.
 */
final readonly class SkillPolicy implements Policy
{
    public static function model(): string
    {
        return Skill::class;
    }
}
