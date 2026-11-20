<?php

declare(strict_types=1);

namespace App\Supervision\Types;

use App\Supervision\Enums\CoreAskType;

final readonly class StuckType extends BuiltInAskType
{
    protected function definition(): CoreAskType
    {
        return CoreAskType::Stuck;
    }
}
