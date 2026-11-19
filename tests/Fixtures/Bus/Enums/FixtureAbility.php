<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with the bus and module fixtures.
 */
enum FixtureAbility: string implements DeclaresClassLevelAbilities
{
    case Work = 'work';

    /**
     * Fixture work is decided on the command's class alone.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
