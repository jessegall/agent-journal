<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Skills\Skill;
use App\Support\Shipped\JournalSkill;
use App\Support\Shipped\ProfilesSkill;
use App\Support\Shipped\ShellSkill;
use App\Support\Shipped\SkillsSkill;
use App\Values\SkillOwner;

/**
 * Core's own skills, read at start-up before the domains'.
 */
final class CoreSkills
{
    public const string OWNER = 'Core';

    /**
     * @return list<class-string<Skill>>
     */
    public static function skills(): array
    {
        return [JournalSkill::class, ProfilesSkill::class, SkillsSkill::class, ShellSkill::class];
    }

    /**
     * Core as a supplier of skills; its Markdown parts lie under the project's resources/skills.
     */
    public static function owner(): SkillOwner
    {
        return new SkillOwner(self::OWNER, base_path(), self::skills(), true);
    }
}
