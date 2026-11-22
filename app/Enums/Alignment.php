<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a row places its parts across the card's width.
 */
enum Alignment: string
{
    case Start = 'start';
    case Center = 'center';
    case End = 'end';
    case Between = 'between';
}
