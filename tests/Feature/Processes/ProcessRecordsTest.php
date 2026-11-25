<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\Runs\LifecycleStatus;
use App\Enums\Runs\RunMode;
use App\Exceptions\PartTransitionRefused;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessEvent;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\PartEnd;
use App\Values\PartKey;
use App\Values\ProcessEventFacts;
use Tests\Support\ChecksSchemaTables;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * Runs, parts, events and output chunks are stored as four observations with legal lifecycle moves only.
 */
final class ProcessRecordsTest extends TestCase
{
    use ChecksSchemaTables;
    use RefreshHookDatabase;

    protected static function storedTables(): array
    {
        return ['process_runs', 'part_runs', 'process_events', 'output_chunks'];
    }

    public function test_a_part_moves_queued_running_draining_ended_and_never_skips_to_ended(): void
    {
        $part = $this->part();

        $part->start('host-a', 4242);
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();

        $this->assertSame(LifecycleStatus::Ended, $part->refresh()->lifecycle);
        $this->expectException(PartTransitionRefused::class);
        $this->part('second')->finishDraining();
    }

    public function test_a_part_with_an_exit_but_undrained_streams_is_not_ended(): void
    {
        $part = $this->part();
        $part->start('host-a', 1);

        $part->finishProcess(PartEnd::exited(1));

        $this->assertSame(LifecycleStatus::Draining, $part->refresh()->lifecycle);
        $this->assertFalse($part->streams_drained);
    }

    public function test_a_repeated_event_is_kept_once_and_a_conflicting_one_is_an_operational_error(): void
    {
        $run = $this->admittedRun();

        $part = new PartKey(1, 1, 'a');

        ProcessEvent::create($run, 1, ProcessEventFacts::partStartedInside($part));
        ProcessEvent::create($run, 1, ProcessEventFacts::partStartedInside($part));
        $conflict = ProcessEvent::create($run, 1, ProcessEventFacts::partLost($part));

        $this->assertSame(2, $run->events()->count());
        $this->assertSame(ProcessEvent::OPERATIONAL_ERROR, $conflict->type);
        $this->assertSame(1, $conflict->payload->conflictsWith);
        $this->assertSame('part_lost', $conflict->payload->conflicting?->type);
    }

    private function admittedRun(RunMode $mode = RunMode::Normal, string $admission = 'admission-1'): ProcessRun
    {
        return ProcessRun::create(ActorIdentity::system(), TestRunAdmissions::of(admissionId: $admission, mode: $mode));
    }

    private function part(string $partId = 'first'): PartRun
    {
        $run = $this->admittedRun(RunMode::Normal, "admission-{$partId}");

        return PartRun::create($run, new PartKey(1, 1, 'core.ls'));
    }
}
