<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Accounts\Enums\UsageWindowSlot;
use App\Agents\Drivers\ClaudeCode\TurnResult;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Values\UsageCost;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

/**
 * A recorded headless turn, read chunk by chunk as the host sends it, gives its model, its limit window, its one
 * result's exact cost and a successful end; a turn that exits non-zero, or prints no result, does not.
 */
final class ClaudeResultTest extends TestCase
{
    private const string RECORDINGS = __DIR__.'/../../../resources/recordings/claude-code/2.1.323';

    public function test_each_recorded_turn_gives_its_model_window_cost_and_success(): void
    {
        $recorded = [
            'turns/process-turn' => ['0.0278512', 78.0],
            'one-shot-allowlist' => ['0.0315396', 75.0],
        ];

        foreach ($recorded as $name => [$cost, $percent]) {
            $result = new TurnResult('process-1');
            $usage = [];

            foreach ($this->stdoutOf($name) as $bytes) {
                $usage = [...$usage, ...$result->read($bytes, CarbonImmutable::parse('2026-11-26 10:00:00'))];
            }

            $end = $result->end(0);
            $costs = array_values(array_filter($usage, fn ($reading) => $reading instanceof UsageCost));
            $windows = array_values(array_filter($usage, fn ($reading) => $reading instanceof UsageWindowReading));

            $this->assertSame(
                [[$cost.'00000'], [UsageWindowSlot::SevenDay], [$percent], 'claude-opus-5-5', RequestProgress::Applied],
                [
                    array_map(fn (UsageCost $reading) => $reading->usd->amount, $costs),
                    array_map(fn (UsageWindowReading $reading) => $reading->slot, $windows),
                    array_map(fn (UsageWindowReading $reading) => round((float) $reading->usedPercent, 6), $windows),
                    $end->model,
                    $end->progress(),
                ],
                $name,
            );
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
     * @return list<string>
     */
    private function stdoutOf(string $name): array
    {
        $fixture = json_decode((string) file_get_contents(self::RECORDINGS."/{$name}/fixture.json"), true, flags: JSON_THROW_ON_ERROR);
        $stdout = array_filter($fixture['output'], fn (array $chunk) => $chunk['stream'] === 'stdout');

        return array_values(array_map(fn (array $chunk) => (string) base64_decode($chunk['bytes'], true), $stdout));
    }
}
