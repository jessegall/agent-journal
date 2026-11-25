<?php

declare(strict_types=1);

namespace App\Enums\Agents;

enum StackStatus: string
{
    case Active = 'active';
    case Closed = 'closed';
}
