<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Enums\CoreAskType;

final readonly class StuckType extends BuiltInAskType
{
    protected function definition(): CoreAskType
    {
        return CoreAskType::Stuck;
    }
}
