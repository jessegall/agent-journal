<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Codex\CodexTurnResult;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Support\Recordings\CutExchange;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\RecordedEvent;
use App\Support\Recordings\Recordings;
use Carbon\CarbonImmutable;
use Tests\TestCase;

/**
 * Each recorded codex exec turn, read chunk by chunk as the host sends it, names the thread its first turn started,
 * which every later turn resumes, and ends applied; a turn that exits non-zero having printed nothing fails.
 */
final class CodexTurnResultTest extends TestCase
{
    public function test_every_recorded_exec_turn_names_the_first_turns_thread_and_ends_applied(): void
    {
        $turns = $this->execTurnsOf('headless-turn');
        $threads = [];
        $progress = [];

        foreach ($turns as $turn) {
            $result = new CodexTurnResult();

            foreach ($turn->events as $event) {
                $result->read($this->stdoutOf($event), CarbonImmutable::parse('2026-11-28 06:00:00'));
            }

            $threads[] = $result->conversation();
            $progress[] = $result->end($turn->exitCode)->progress();
        }

        $this->journal->assertResult(
            [3, 1, [RequestProgress::Applied, RequestProgress::Applied, RequestProgress::Applied]],
            [count($turns), count(array_unique(array_filter($threads))), $progress],
        );
    }

    public function test_a_turn_that_exits_non_zero_having_printed_nothing_fails(): void
    {
        $this->journal->assertResult(RequestProgress::Failed, new CodexTurnResult()->end(1)->progress());
    }

    /**
     * The driver exchanges of the scenario that ran a codex exec turn, in the order they ran.
     *
     * @return list<CutExchange>
     */
    private function execTurnsOf(string $scenario): array
    {
        $recording = $this->app->make(Recordings::class)->scenario('codex', $scenario);
        $exchanges = array_map($recording->exchange(...), $recording->exchangesOn(Wire::Driver));

        return array_values(array_filter(
            $exchanges,
            fn (CutExchange $exchange) => in_array('exec', $exchange->opening->argv, true),
        ));
    }

    private function stdoutOf(RecordedEvent $event): string
    {
        return $event->stream === 'stdout' ? $event->bytes : '';
    }
}
