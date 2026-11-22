<?php

declare(strict_types=1);

namespace App\Enums;

enum StackStatus: string
{
    case Active = 'active';
    case Closed = 'closed';
}
