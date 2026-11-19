<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

/**
 * What an actor may do with document recovery.
 */
enum DocumentAbility: string
{
    case Administer = 'administer';
}
