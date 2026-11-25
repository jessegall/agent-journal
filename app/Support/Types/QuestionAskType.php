<?php

declare(strict_types=1);

namespace App\Support\Types;

use App\Enums\Asks\CoreAskType;

final readonly class QuestionAskType extends BuiltInAskType
{
    protected function definition(): CoreAskType
    {
        return CoreAskType::Question;
    }
}
