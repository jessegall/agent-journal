<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a search was asked: the agent's search tool or the person's search dialog.
 */
enum SearchSurface: string
{
    case AgentTool = 'agent_tool';
    case Palette = 'palette';
}
