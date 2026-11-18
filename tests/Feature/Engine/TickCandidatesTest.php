<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Contracts\DomainAvailability;
use App\Domains\Support\DomainStateType;
use App\Domains\Support\DomainTickableStateType;
use App\Engine\Support\EnginePass;
use App\Engine\Support\TickCandidates;
use App\Engine\Values\TickBatch;
use App\Engine\Values\TickCandidate;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Ticks\CountingTickingLoader;
use Tests\Fixtures\Hooks\Ticks\UnreadLoader;
use Tests\Support\BuildsTickingStacks;
use Tests\Support\CommitsHookRows;
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

    private CountingTickingLoader $ticking;

    private CountingTickingLoader $switchable;

    private bool $switchedOn = false;

    protected function setUp(): void
    {
        parent::setUp();

        $this->ticking = new CountingTickingLoader;
        $this->switchable = new CountingTickingLoader;
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register('test.ticking', $this->ticking);
            $event->registry->register('test.plain', new UnreadLoader);
            $event->registry->register('test.switchable', new DomainTickableStateType(new DomainStateType('Switchable', $this->switchable, fn () => $this->availability())));
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
        $this->assertContains('a-2', array_map(fn (FrameRecord $record) => $record->id, AgentStackRow::query()->tickingOpen()->readLimit(1)->sole()->frames->all()));
    }

    public function test_a_switched_off_domains_ticking_frame_is_skipped_unread_and_stays_stored_until_it_is_on(): void
    {
        $row = $this->tickingStack('test.switchable', ['b-1'], CarbonImmutable::now());

        $this->assertSame([], $this->nextBatch(100)->candidates);
        $this->assertSame([], $this->switchable->batchSizes);
        $this->assertContains('b-1', array_map(fn (FrameRecord $record) => $record->id, $row->refresh()->frames->all()));

        $this->switchedOn = true;

        $this->assertSame(['b-1'], array_map(fn (TickCandidate $candidate) => $candidate->frameId, $this->nextBatch(100)->candidates));
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
     * A running session's stack with the given number of ticking frames named after the prefix.
     *
     * @return list<array{string, int, string}> stack id, position and frame id of each ticking frame
     */
    private function stackWith(int $tickingFrames, string $prefix): array
    {
        $subjects = array_map(fn (int $number) => "{$prefix}-{$number}", range(1, $tickingFrames));
        $row = $this->tickingStack('test.ticking', $subjects, CarbonImmutable::now());

        return array_map(fn (int $index) => [$row->id, $index + 2, $subjects[$index]], array_keys($subjects));
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

    private function availability(): DomainAvailability
    {
        return new readonly class($this->switchedOn) implements DomainAvailability
        {
            public function __construct(private bool $switchedOn) {}

            public function isEnabled(string $owner): bool
            {
                return $this->switchedOn;
            }
        };
    }

    private function nextBatch(int $limit): TickBatch
    {
        return $this->app->make(EnginePass::class)->run(fn () => $this->app->make(TickCandidates::class)->next($limit));
    }
}
