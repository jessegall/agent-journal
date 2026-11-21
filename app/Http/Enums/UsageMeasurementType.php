<?php

declare(strict_types=1);

namespace App\Http\Enums;

/**
 * What a host's usage report measured: a limit window, the cost of one result, or a thread's token count.
 */
enum UsageMeasurementType: string
{
    case Window = 'window';
    case ResultCost = 'result_cost';
    case ThreadTokens = 'thread_tokens';
}
