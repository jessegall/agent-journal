<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

enum TransportProfileType: string
{
    case Mcp = 'mcp';
    case Cli = 'cli';
}
