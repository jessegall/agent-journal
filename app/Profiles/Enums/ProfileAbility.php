<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * What an actor may do with agent profiles and the main launch.
 */
enum ProfileAbility: string
{
    case Administer = 'administer';
}
