<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * Why the selector called a matching state method.
 */
enum SelectionReason: string
{
    case FirstMatch = 'first_match';
    case StackWide = 'stack_wide';
}
