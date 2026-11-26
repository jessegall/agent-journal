<?php

declare(strict_types=1);

namespace App\Web\Enums;

/**
 * How strongly a button stands out among the parts beside it.
 */
enum Emphasis: string
{
    case Primary = 'primary';
    case Secondary = 'secondary';
    case Quiet = 'quiet';
}
