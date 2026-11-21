<?php

declare(strict_types=1);

namespace App\Http\Enums;

use App\Http\Data\Agents\ThreadTokensData;
use App\Http\Data\Agents\UsageCostData;
use App\Http\Data\Agents\UsageMeasurementData;
use App\Http\Data\Agents\UsageWindowData;

/**
 * What a host's usage report measured: a limit window, the cost of one result, or a thread's token count.
 */
enum UsageMeasurementType: string
{
    case Window = 'window';
    case ResultCost = 'result_cost';
    case ThreadTokens = 'thread_tokens';

    /**
     * The data the measurement of this type is read into.
     *
     * @return class-string<UsageMeasurementData>
     */
    public function dataClass(): string
    {
        return match ($this) {
            self::Window => UsageWindowData::class,
            self::ResultCost => UsageCostData::class,
            self::ThreadTokens => ThreadTokensData::class,
        };
    }
}
