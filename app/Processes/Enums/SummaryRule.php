<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Whether a tool's output must end with a summary record.
 */
enum SummaryRule: string
{
    case RequiredTerminalRecord = 'required_terminal_record';
    case NotRequired = 'not_required';
}
