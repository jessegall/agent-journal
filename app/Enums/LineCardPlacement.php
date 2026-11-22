<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where the chat draws the card of the record a line names: in the log in the line's place, or beside the chat once
 * the line is chosen, while the line itself stays a plain line.
 */
enum LineCardPlacement: string
{
    case Inline = 'inline';
    case Panel = 'panel';
}
