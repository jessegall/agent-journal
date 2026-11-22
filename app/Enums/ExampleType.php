<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Whether a proposal's example is a line the rule must match, with the classes it must give, or a line it must not.
 */
enum ExampleType: string
{
    case Positive = 'positive';
    case Negative = 'negative';
}
