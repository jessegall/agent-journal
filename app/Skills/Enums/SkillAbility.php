<?php

declare(strict_types=1);

namespace App\Skills\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with the stored skills.
 */
enum SkillAbility: string implements ClassLevelAbilities
{
    case Administer = 'administer';
    case Work = 'work';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
