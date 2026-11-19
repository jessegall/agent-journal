<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What an actor may do with key scripts run on agent terminals.
 */
enum KeyScriptAbility: string
{
    case Administer = 'administer';
}
