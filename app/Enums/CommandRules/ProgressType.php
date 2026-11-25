<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * How a check reports how far it has got.
 */
enum ProgressType: string
{
    case ExactTotal = 'exact_total';
    case ToolPercent = 'tool_percent';
    case Indeterminate = 'indeterminate';
}
