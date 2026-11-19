<?php

declare(strict_types=1);

namespace App\Sharing\Enums;

/**
 * What an actor may do with shares: ask for one, or run the sharing itself.
 */
enum SharingAbility: string
{
    case Request = 'request';
    case Administer = 'administer';
}
