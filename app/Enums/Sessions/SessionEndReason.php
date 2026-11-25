<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

enum SessionEndReason: string
{
    case Exit = 'exit';
    case Clear = 'clear';
    case Logout = 'logout';
    case Other = 'other';
}
