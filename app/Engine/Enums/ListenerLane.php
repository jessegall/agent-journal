<?php

declare(strict_types=1);

namespace App\Engine\Enums;

/**
 * When a listener receives its event: inside the command's own transaction, so a failure rolls the command back, or after
 * the real commit, through Laravel's dispatcher.
 */
enum ListenerLane: string
{
    case InCommandTransaction = 'in-command-transaction';
    case AfterCommit = 'after-commit';
}
