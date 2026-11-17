<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Storage;

enum StackStatus: string
{
    case Active = 'active';
    case Closed = 'closed';
}
