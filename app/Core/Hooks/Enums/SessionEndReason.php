<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

enum SessionEndReason: string
{
    case Exit = 'exit';
    case Clear = 'clear';
    case Logout = 'logout';
    case Other = 'other';
}
