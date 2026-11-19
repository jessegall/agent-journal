<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What an actor may do with command rules, their requests, approvals and process output.
 */
enum ProcessAbility: string
{
    case Administer = 'administer';
}
