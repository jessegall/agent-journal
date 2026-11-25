<?php

declare(strict_types=1);

namespace App\Enums\Accounts;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which window of a limit a reading is about: Claude's five-hour and seven-day windows, or the primary and secondary
 * windows Codex reports without naming their length.
 */
#[TypeScript]
enum UsageWindowSlot: string
{
    case FiveHour = 'five_hour';
    case SevenDay = 'seven_day';
    case Primary = 'primary';
    case Secondary = 'secondary';
}
