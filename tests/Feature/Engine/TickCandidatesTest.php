<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Engine\Support\EnginePass;
use App\Engine\Support\TickCandidates;
use App\Engine\Values\TickBatch;
use App\Engine\Values\TickCandidate;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Ticks\CountingTickingLoader;
use Tests\Fixtures\Hooks\Ticks\UnreadLoader;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The engine selects ticking frames across stacks in stack and frame order, a bounded number per pass, going on where
 * the last pass stopped; it restores only ticking types in batches of at most 100, skips finished frames without
 * removing them, and drops a frame an earlier command removed.
 */
final class TickCandidatesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'agent_stacks'];

    private CountingTickingLoader $ticking;

    protected function setUp(): void
    {
        parent::setUp();

        $this->ticking = new CountingTickingLoader;
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register('test.ticking', $this->ticking);
            $event->registry->register('test.plain', new UnreadLoader);
        });
    }

    public function test_three_passes_of_one_hundred_visit_250_frames_over_30_stacks_once_in_order(): void
    {
        $expected = [];

        foreach (range(1, 30) as $stack) {
            $expected = [...$expected, ...$this->stackWith($stack <= 10 ? 9 : 8, "s{$stack}")];
        }

        $visited = [];

        foreach (range(1, 3) as $pass) {
            $visited = [...$visited, ...array_map(fn (TickCandidate $candidate) => $candidate->frameId, $this->nextBatch(100)->candidates)];
        }

        $this->assertSame($this->inStackOrder($expected), $visited);
        $this->assertLessThanOrEqual(100, max([0, ...$this->ticking->batchSizes]));
        $this->assertSame(100, $this->nextBatch(100)->count());
    }

    public function test_a_finished_frame_is_skipped_and_stays_stored(): void
    {
        $this->stackWith(3, 'a');
        $this->ticking->finished = ['a-2'];

        $batch = $this->nextBatch(100);

        $this->assertSame(['a-1', 'a-3'], array_map(fn (TickCandidate $candidate) => $candidate->frameId, $batch->candidates));
        $this->assertSame(4, count(AgentStackRow::query()->tickingOpen()->readLimit(1)->sole()->frames->all()));
    }

    public function test_a_frame_an_earlier_command_removed_is_not_ticked(): void
    {
        $this->stackWith(2, 'a');
        [$first, $second] = $this->nextBatch(100)->candidates;
        $row = AgentStackRow::query()->authorizedFor($first->target)->sole();
        $row->saveFrames(new FrameRecords(array_values(array_filter($row->frames->all(), fn (FrameRecord $record) => $record->id !== 'a-2'))), $this->app->make(StateTypes::class)->ticking());

        $candidates = $this->app->make(TickCandidates::class);

        $this->assertTrue($candidates->refresh($first)->isDefined());
        $this->assertTrue($candidates->refresh($second)->isEmpty());
    }

    /**
     * A running session's stack: a bottom frame, a frame of a type that does not tick, and the given number of ticking
     * frames named after the prefix.
     *
     * @return list<array{string, int, string}> stack id, position and frame id of each ticking frame
     */
    private function stackWith(int $tickingFrames, string $prefix): array
    {
        $agent = Agent::query()->create(['name' => "Agent {$prefix}", 'role' => 'hooks.main_ready']);
        $session = new AgentSession;
        $session->startFor($agent, null);
        $records = [
            new FrameRecord("{$prefix}-ready", new StateReference('hooks.main_ready', NoSubject::None), true, 1, CarbonImmutable::now()),
            new FrameRecord("{$prefix}-plain", new StateReference('test.plain', NoSubject::None), false, 1, CarbonImmutable::now()),
        ];

        foreach (range(1, $tickingFrames) as $number) {
            $records[] = new FrameRecord("{$prefix}-{$number}", new StateReference('test.ticking', new SubjectReference("{$prefix}-{$number}", 1)), false, 1, CarbonImmutable::now());
        }

        $row = new AgentStackRow;
        $row->startFor(new StackTarget($agent->id, $session->id), new FrameRecords($records), $this->app->make(StateTypes::class)->ticking());

        return array_map(fn (int $number) => [$row->id, $number + 1, "{$prefix}-{$number}"], range(1, $tickingFrames));
    }

    /**
     * @param  list<array{string, int, string}>  $frames
     * @return list<string>
     */
    private function inStackOrder(array $frames): array
    {
        usort($frames, fn (array $one, array $other) => [$one[0], $one[1]] <=> [$other[0], $other[1]]);

        return array_map(fn (array $frame) => $frame[2], $frames);
    }

    private function nextBatch(int $limit): TickBatch
    {
        return $this->app->make(EnginePass::class)->run(fn () => $this->app->make(TickCandidates::class)->next($limit));
    }
}
