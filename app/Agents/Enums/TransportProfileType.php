<?php

declare(strict_types=1);

namespace App\Agents\Enums;

enum TransportProfileType: string
{
    case Mcp = 'mcp';
    case Cli = 'cli';
}
