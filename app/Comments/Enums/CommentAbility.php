<?php

declare(strict_types=1);

namespace App\Comments\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with comments.
 */
enum CommentAbility: string implements ClassLevelAbilities
{
    case Work = 'work';

    /**
     * Ordinary work is decided on the model class alone.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
