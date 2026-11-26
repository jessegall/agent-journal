<?php

declare(strict_types=1);

namespace App\Notifications\Enums;

/**
 * The business event a notification comes from.
 */
enum NotificationSourceType: string
{
    case Question = 'question';
    case Report = 'report';
    case MergeAsk = 'merge_ask';
    case RunOutcome = 'run_outcome';
}
