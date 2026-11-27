<?php

declare(strict_types=1);

namespace App\Skills;

use App\Skills\Contracts\Skill;
use App\Support\FolderClasses;
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
        return FolderClasses::in(__DIR__.'/Shipped', Skill::class);
    }

    /**
     * Core as a supplier of skills; its Markdown parts lie under the project's resources/skills.
     */
    public static function owner(): SkillOwner
    {
        return new SkillOwner(self::OWNER, base_path(), self::skills(), true);
    }
}
