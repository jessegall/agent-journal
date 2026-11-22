<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Whether a tool's standard output and error must stay apart or may be merged.
 */
enum StreamUse: string
{
    case Separate = 'separate';
    case MergeAllowed = 'merge_allowed';
}
