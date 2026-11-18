<?php

declare(strict_types=1);

namespace App\Text\Enums;

/**
 * What a text anchor points at: a whole section, a span of lines, or an exact quote within lines.
 */
enum TextAnchorType: string
{
    case Section = 'section';
    case Lines = 'lines';
    case Quote = 'quote';
}
