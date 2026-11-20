<?php

declare(strict_types=1);

namespace App\Mcp\Enums;

enum DiscoveryProfile: string
{
    case MainAgent = 'main-agent';
    case WritingHelper = 'writing-helper';
    case ReadOnlyHelper = 'read-only-helper';
}
