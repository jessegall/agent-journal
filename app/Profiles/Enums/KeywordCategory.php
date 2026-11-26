<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

enum KeywordCategory: string
{
    case Structure = 'structure';
    case Trigger = 'trigger';
    case Operator = 'operator';
    case Statement = 'statement';
}
