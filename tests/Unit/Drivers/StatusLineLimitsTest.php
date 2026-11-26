<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\StatusLineLimits;
use App\Enums\Accounts\UsageWindowSlot;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use Tests\TestCase;

/**
 * A status-line input gives its five-hour and seven-day windows with their percent and reset; a window out of range,
 * a missing one or an input that is no JSON gives none.
 */
final class StatusLineLimitsTest extends TestCase
{
    public function test_the_two_windows_are_read_and_nothing_else(): void
    {
        $input = '{"model":{"id":"m"},"rate_limits":{"five_hour":{"used_percentage":12.5,"resets_at":1795449600},'
            .'"seven_day":{"used_percentage":140}}}';

        $readings = StatusLineLimits::readingsOf($input, 'process-1-status-0', 3, CarbonImmutable::parse('2026-11-26'));

        $this->assertSame(
            [[
                UsageWindowSlot::FiveHour,
                12.5,
                1795449600,
                'process-1-status-0-five_hour',
            ]],
            array_map(
                fn (UsageWindowReading $reading) => [
                    $reading->slot,
                    $reading->usedPercent,
                    $reading->resetsAt,
                    $reading->source->id,
                ],
                $readings,
            ),
        );
        $this->assertSame([], StatusLineLimits::readingsOf('not json', 'p', 0, CarbonImmutable::now()));
    }
}
