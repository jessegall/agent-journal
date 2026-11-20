<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

enum TaskWatchAbility: string implements DeclaresClassLevelAbilities
{
    case Record = 'record';

    public function isClassLevel(): bool
    {
        return true;
    }
}
