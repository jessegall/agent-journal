<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Accounts\Enums\UsageWindowSlot;
use App\Agents\Drivers\Data\StatusLineInputData;
use App\Agents\Values\UsageSource;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * The part of Claude Code's status-line input the journal reads, as its status line hands it over a side socket: the
 * five-hour and seven-day windows, each with its used percent, already from 0 to 100, and its reset in Unix seconds.
 * Nothing else of the input is kept.
 */
final readonly class StatusLineLimits
{
    /**
     * The side socket the status line writes to, and the stream its bytes arrive on.
     */
    public const string SOCKET = 'status';

    private const string LIMIT = 'claude';

    /**
     * The windows the journal reads, by the name the status line gives each.
     */
    private const array WINDOWS = [
        'five_hour' => UsageWindowSlot::FiveHour,
        'seven_day' => UsageWindowSlot::SevenDay,
    ];

    /**
     * The windows of one status-line input with a used percent from 0 to 100; an input that is no JSON, or no status
     * line, has none.
     *
     * @return list<UsageWindowReading>
     */
    public static function readingsOf(string $input, string $sourceId, int $order, CarbonImmutable $now): array
    {
        try {
            $limits = StatusLineInputData::from(json_decode($input, true, flags: JSON_THROW_ON_ERROR))->rateLimits;
        } catch (JsonException|CannotCreateData) {
            return [];
        }

        $readings = [];

        foreach (self::WINDOWS as $key => $slot) {
            $window = $limits[$key] ?? null;

            if ($window === null || ! $window->isMeasured()) {
                continue;
            }

            $source = UsageSource::of("{$sourceId}-{$key}", $order, $now);
            $percent = $window->usedPercentage;
            $readings[] = new UsageWindowReading(self::LIMIT, $slot, $percent, null, $window->resetsAt, $source);
        }

        return $readings;
    }
}
