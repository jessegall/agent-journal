<?php

declare(strict_types=1);

namespace App\Domain\Rules;

enum RuleState: string
{
    case Active = 'active';
    case Removed = 'removed';
}
