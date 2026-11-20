<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Bus\Contracts\ClassLevelAbilities;

enum TaskWatchAbility: string implements ClassLevelAbilities
{
    case Record = 'record';

    public function isClassLevel(): bool
    {
        return true;
    }
}
