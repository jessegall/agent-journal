<?php

declare(strict_types=1);

namespace App\Skills\Policies;

use App\Actors\Contracts\Policy;
use App\Skills\Models\Skill;

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
