<?php

declare(strict_types=1);

namespace App\Sessions\Enums;

enum TransportProfileType: string
{
    case Mcp = 'mcp';
    case Cli = 'cli';
}
