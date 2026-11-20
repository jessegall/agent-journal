<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with the notes.
 */
enum NoteWorkAbility: string implements ClassLevelAbilities
{
    case Work = 'work';

    /**
     * The work is decided on the model class alone.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
