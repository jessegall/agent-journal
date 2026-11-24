<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Events\StateTypesRequested;
use App\Models\Agents\AgentStackRow;
use App\Support\EnginePass;
use App\Support\Stack\StateTypes;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\TickCandidates;
use App\Values\TickBatch;
use App\Values\TickCandidate;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Hooks\Ticks\TickingState;
use Tests\Fixtures\Hooks\Ticks\UnreadState;
use Tests\Support\BuildsTickingStacks;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\TickingFramePlace;
use Tests\TestCase;

/**
 * The engine selects ticking frames across stacks in stack and frame order, a bounded number per pass, going on where
 * the last pass stopped; it restores only ticking types in batches of at most 100, skips finished frames without
 * removing them, skips a switched-off domain's frames unread, and drops a frame an earlier command removed.
 */
final class TickCandidatesTest extends TestCase
{
    use BuildsTickingStacks;
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'agent_stacks'];

    private FinishedSubjects $finished;

    private bool $isSwitchedOn = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->finished = new FinishedSubjects();
        $this->app->instance(FinishedSubjects::class, $this->finished);
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register(RegisteredStateType::named('test.ticking', TickingState::class));
            $event->registry->register(RegisteredStateType::named('test.plain', UnreadState::class));
            $event->registry->register(
                RegisteredStateType::named('test.switchable', TickingState::class)->switchedBy(fn (): bool => $this->isSwitchedOn),
            );
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
            $visited = [
                ...$visited,
                ...array_map(fn (TickCandidate $candidate) => $candidate->frameId, $this->nextBatch(100)->candidates),
            ];
        }

        $this->assertSame($this->inStackOrder($expected), $visited);
        $this->assertSame(100, $this->nextBatch(100)->count());
    }

    public function test_a_finished_frame_is_skipped_and_stays_stored(): void
    {
        $this->stackWith(3, 'a');
        $this->finished->finished = ['a-2'];

        $batch = $this->nextBatch(100);

        $this->assertSame(
            ['a-1', 'a-3'],
            array_map(fn (TickCandidate $candidate) => $candidate->frameId, $batch->candidates),
        );
        $this->assertContains(
            'a-2',
            array_map(
                fn (FrameRecord $record) => $record->id,
                AgentStackRow::query()->tickingOpen()->limit(1)->sole()->frames->all(),
            ),
        );
    }

    public function test_a_switched_off_domains_ticking_frame_is_skipped_unread_and_stays_stored_until_it_is_on(): void
    {
        $row = $this->tickingStack('test.switchable', ['b-1'], CarbonImmutable::now());

        $this->assertSame([], $this->nextBatch(100)->candidates);
        $this->assertContains(
            'b-1',
            array_map(fn (FrameRecord $record) => $record->id, $row->refresh()->frames->all()),
        );

        $this->isSwitchedOn = true;

        $this->assertSame(
            ['b-1'],
            array_map(fn (TickCandidate $candidate) => $candidate->frameId, $this->nextBatch(100)->candidates),
        );
    }

    public function test_a_frame_an_earlier_command_removed_is_not_ticked(): void
    {
        $this->stackWith(2, 'a');
        [$first, $second] = $this->nextBatch(100)->candidates;
        $row = AgentStackRow::query()->authorizedFor($first->target)->sole();
        $row->saveFrames(
            new FrameRecords(
                array_values(array_filter($row->frames->all(), fn (FrameRecord $record) => $record->id !== 'a-2')),
            ),
            $this->app->make(StateTypes::class)->ticking(),
        );

        $candidates = $this->app->make(TickCandidates::class);

        $this->assertTrue($candidates->refresh($first)->isDefined());
        $this->assertTrue($candidates->refresh($second)->isEmpty());
    }

    /**
     * A running session's stack with the given number of ticking frames named after the prefix.
     *
     * @return list<TickingFramePlace>
     */
    private function stackWith(int $tickingFrames, string $prefix): array
    {
        $subjects = array_map(fn (int $number) => "{$prefix}-{$number}", range(1, $tickingFrames));
        $row = $this->tickingStack('test.ticking', $subjects, CarbonImmutable::now());

        return array_map(
            fn (int $index) => new TickingFramePlace($row->id, $index + 2, $subjects[$index]),
            array_keys($subjects),
        );
    }

    /**
     * @param  list<TickingFramePlace>  $frames
     * @return list<string>
     */
    private function inStackOrder(array $frames): array
    {
        usort($frames, fn (TickingFramePlace $one, TickingFramePlace $other) => $one->compare($other));

        return array_map(fn (TickingFramePlace $frame) => $frame->frameId, $frames);
    }

    private function nextBatch(int $limit): TickBatch
    {
        return $this->app->make(EnginePass::class)->run(fn () => $this->app->make(TickCandidates::class)->next($limit));
    }
}
