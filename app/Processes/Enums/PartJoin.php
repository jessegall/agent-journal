<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * How a command part joins the part after it.
 */
enum PartJoin: string
{
    case Pipe = 'pipe';
    case And = 'and';
    case Or = 'or';
    case Sequence = 'sequence';
    case End = 'end';
}
