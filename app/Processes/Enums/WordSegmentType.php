<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * How one piece of a shell word was written, so quoting, escapes and expansions survive parsing.
 */
enum WordSegmentType: string
{
    case Literal = 'literal';
    case SingleQuoted = 'single_quoted';
    case DoubleQuoted = 'double_quoted';
    case Escaped = 'escaped';
    case Expansion = 'expansion';
}
