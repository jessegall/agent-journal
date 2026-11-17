<?php

declare(strict_types=1);

namespace App\Domain\Agents;

enum SessionStatus: string
{
    case Active = 'active';
    case Ended = 'ended';
}
