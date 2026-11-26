<?php

declare(strict_types=1);

namespace App\Support\Drivers\Processes;

use App\Attributes\Rules\DecodesAnyJson;
use App\Enums\Accounts\UsageWindowSlot;
use App\Values\TurnEnd;
use App\Values\UsageCost;
use App\Values\UsageSource;
use App\Values\UsageWindowReading;
use App\Values\UsdAmount;
use Brick\Math\BigDecimal;
use Brick\Math\Exception\MathException;
use Brick\Math\RoundingMode;
use Carbon\CarbonImmutable;

/**
 * What a headless Claude Code turn printed as stream-json, read chunk by chunk as it arrives: the model it ran, each
 * limit window and each result's cost as they are read, and the last result's subtype and error flag. Nothing else of
 * the output is kept.
 */
final class ClaudeResult
{
    /**
     * The limit every Claude window belongs to.
     */
    private const string LIMIT = 'claude';

    /**
     * The part of the output after its last newline, kept until the rest of its line arrives.
     */
    private string $partial = '';

    private int $lines = 0;

    private int $results = 0;

    private string|null $model = null;

    /**
     * @var array{subtype: string|null, is_error: bool}|null
     */
    private array|null $lastResult = null;

    /**
     * @var list<UsageWindowReading|UsageCost>
     */
    private array $usage = [];

    public function __construct(private readonly string $processId) {}

    /**
     * Reads the bytes printed next and answers the usage they reported, in the order it was printed.
     *
     * @return list<UsageWindowReading|UsageCost>
     */
    public function read(string $bytes, CarbonImmutable $now): array
    {
        $lines = explode("\n", $this->partial.$bytes);
        $this->partial = (string) array_pop($lines);
        $this->usage = [];

        foreach ($lines as $line) {
            $this->readLine($line, $now);
        }

        return $this->usage;
    }

    /**
     * The turn as the host saw it end: the exit code, the last result read, the model, and why it ended badly.
     */
    public function end(int|null $exitCode, string|null $problem = null): TurnEnd
    {
        return new TurnEnd(
            exitCode: $exitCode,
            isResultRead: $this->lastResult !== null,
            resultSubtype: $this->lastResult['subtype'] ?? null,
            isResultError: $this->lastResult['is_error'] ?? false,
            model: $this->model,
            problem: $problem,
        );
    }

    /**
     * One stream-json line of the driver's own output, of whichever of its many event types it is; only the fields the
     * journal reads are taken from it.
     */
    #[DecodesAnyJson]
    private function readLine(string $line, CarbonImmutable $now): void
    {
        $this->lines++;
        $decoded = json_decode($line, true);

        if (! is_array($decoded)) {
            return;
        }

        match ($decoded['type'] ?? null) {
            'rate_limit_event' => $this->readWindows($decoded['rate_limit_info'] ?? null, $now),
            'system' => $this->readModel($decoded),
            'result' => $this->readResult($decoded, $now),
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $line
     */
    private function readModel(array $line): void
    {
        if (($line['subtype'] ?? null) === 'init' && is_string($line['model'] ?? null) && $line['model'] !== '') {
            $this->model = $line['model'];
        }
    }

    /**
     * Each measured window of the event on its own, so a malformed window never drops a valid sibling.
     */
    private function readWindows(mixed $info, CarbonImmutable $now): void
    {
        if (! is_array($info)) {
            return;
        }

        if (! is_array($info['unifiedWindows'] ?? null)) {
            $this->readWindow(UsageWindowSlot::tryFrom((string) ($info['rateLimitType'] ?? '')), $info, $now);

            return;
        }

        $this->readWindow(UsageWindowSlot::FiveHour, $info['unifiedWindows']['five_hour'] ?? null, $now);
        $this->readWindow(UsageWindowSlot::SevenDay, $info['unifiedWindows']['seven_day'] ?? null, $now);
    }

    /**
     * A five-hour or seven-day window with a utilization from 0 to 1, as a percent, and its reset when reported.
     */
    private function readWindow(UsageWindowSlot|null $slot, mixed $window, CarbonImmutable $now): void
    {
        if (! in_array($slot, [
            UsageWindowSlot::FiveHour,
            UsageWindowSlot::SevenDay,
        ], true) || ! is_array($window)) {
            return;
        }

        $fraction = $window['utilization'] ?? null;

        if (! is_int($fraction) && ! is_float($fraction) || $fraction < 0 || $fraction > 1) {
            return;
        }

        $resetsAt = is_int($window['resetsAt'] ?? null) ? $window['resetsAt'] : null;
        $source = UsageSource::of($this->sourceOf('window', $slot->value), $this->lines, $now);
        $this->usage[] = new UsageWindowReading(self::LIMIT, $slot, $fraction * 100, null, $resetsAt, $source);
    }

    /**
     * @param  array<string, mixed>  $line
     */
    private function readResult(array $line, CarbonImmutable $now): void
    {
        $this->results++;

        $this->lastResult = [
            'subtype' => is_string($line['subtype'] ?? null) ? $line['subtype'] : null,
            'is_error' => ($line['is_error'] ?? false) === true,
        ];

        $cost = $this->costOf($line['model_usage_since_last_result'] ?? null);

        if ($cost !== null) {
            $id = is_string($line['uuid'] ?? null) && $line['uuid'] !== ''
                ? $line['uuid']
                : $this->sourceOf('result', (string) $this->results);

            $this->usage[] = UsageCost::of($id, $cost, $now);
        }
    }

    /**
     * The exact sum of the models' costs since the previous result; none when the map is missing or empty, or any cost
     * in it is not a nonnegative number. The cumulative total is never read.
     */
    private function costOf(mixed $models): UsdAmount|null
    {
        if (! is_array($models) || $models === []) {
            return null;
        }

        $sum = BigDecimal::zero();

        foreach ($models as $model) {
            $cost = is_array($model) ? ($model['costUSD'] ?? null) : null;

            if (! is_int($cost) && ! is_float($cost) && ! is_string($cost)) {
                return null;
            }

            try {
                $value = BigDecimal::of((string) $cost);
            } catch (MathException) {
                return null;
            }

            if ($value->isNegative()) {
                return null;
            }

            $sum = $sum->plus($value);
        }

        return UsdAmount::from($sum->toScale(UsdAmount::MOST_DECIMALS, RoundingMode::Down)->toString());
    }

    private function sourceOf(string $what, string $which): string
    {
        return "{$this->processId}-{$what}-{$which}";
    }
}
