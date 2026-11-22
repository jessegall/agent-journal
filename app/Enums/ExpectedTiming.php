<?php

declare(strict_types=1);

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * When an accepted request is expected to take effect, an advisory judged from the last reported activity.
 */
#[TypeScript]
enum ExpectedTiming: string
{
    case ExpectedNow = 'expected_now';
    case ExpectedNextTurn = 'expected_next_turn';
    case Unknown = 'unknown';
}
