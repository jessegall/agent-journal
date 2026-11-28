<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\Enums\UsageWindowSlot;
use App\Agents\Drivers\ClaudeCode\TurnResult;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Support\Recordings\CutExchange;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\Recordings;
use App\Values\UsageCost;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use Tests\TestCase;

/**
 * A recorded headless turn, read chunk by chunk as the host sends it, gives its model, its limit window, its one
 * result's exact cost and a successful end; a turn that exits non-zero, or prints no result, does not.
 */
final class ClaudeResultTest extends TestCase
{
    public function test_each_recorded_turn_gives_its_model_window_cost_and_success(): void
    {
        $recorded = [
            'headless-turn' => ['0.002659780000', '0.000335900000'],
            'one-shot-allowlist' => ['0.001212000000', '0.000816460000'],
        ];

        foreach ($recorded as $name => $costs) {
            $turns = $this->turnsOf($name);
            $this->assertCount(count($costs), $turns, $name);

            foreach ($turns as $index => $turn) {
                $this->assertRecordedTurn($turn, $costs[$index]);
            }
        }
    }

    public function test_a_turn_that_exits_non_zero_or_prints_no_result_does_not_succeed(): void
    {
        $result = new TurnResult('process-2');
        $result->read("{\"type\":\"system\",\"subtype\":\"init\",\"model\":\"m\"}\n{\"type\":\"res", CarbonImmutable::now());

        $this->assertSame(
            [false, 3, false],
            [
                $result->end(3)->isResultRead,
                $result->end(3)->exitCode,
                $result->end(3)->progress() === RequestProgress::Applied,
            ],
        );
    }

    /**
     * @return list<CutExchange>
     */
    private function turnsOf(string $name): array
    {
        $recording = $this->journal->service(Recordings::class)->scenario('claude-code', $name);
        $exchanges = array_map($recording->exchange(...), $recording->exchangesOn(Wire::Driver));

        return array_values(array_filter(
            $exchanges,
            fn (CutExchange $exchange) => in_array('--print', $exchange->opening->argv, true),
        ));
    }

    private function assertRecordedTurn(CutExchange $turn, string $cost): void
    {
        $result = new TurnResult('process-1');
        $usage = [];
        $now = CarbonImmutable::parse('2026-11-28 06:00:00');

        foreach ($turn->events as $event) {
            if ($event->stream === 'stdout') {
                $usage = [...$usage, ...$result->read($event->bytes, $now)];
            }
        }

        $end = $result->end($turn->exitCode);
        $costs = array_values(array_filter($usage, fn ($reading) => $reading instanceof UsageCost));
        $windows = array_values(array_filter($usage, fn ($reading) => $reading instanceof UsageWindowReading));

        $this->assertSame(
            [[$cost], [UsageWindowSlot::SevenDay], [98.0], 'claude-haiku-5-5', RequestProgress::Applied],
            [
                array_map(fn (UsageCost $reading) => $reading->usd->amount, $costs),
                array_map(fn (UsageWindowReading $reading) => $reading->slot, $windows),
                array_map(fn (UsageWindowReading $reading) => round((float) $reading->usedPercent, 6), $windows),
                $end->model,
                $end->progress(),
            ],
        );
    }
}
