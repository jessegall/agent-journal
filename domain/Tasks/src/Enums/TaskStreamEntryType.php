<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * What one entry of a task's Logs is: a change of the task's state, or a line its worker logged.
 */
enum TaskStreamEntryType: string
{
    case Change = 'change';
    case Log = 'log';
}
