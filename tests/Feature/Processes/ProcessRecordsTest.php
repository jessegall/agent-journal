<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Support\ActorIdentity;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\RunMode;
use App\Processes\Exceptions\PartTransitionRefused;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessEvent;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use Illuminate\Support\Facades\Schema;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * Runs, parts, events and output chunks are stored as four observations with legal lifecycle moves only (doc 21
 * revision 6, sections 53, 54 and 69).
 */
final class ProcessRecordsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_four_tables_exist(): void
    {
        foreach (['process_runs', 'part_runs', 'process_events', 'output_chunks'] as $table) {
            $this->assertTrue(Schema::hasTable($table), "{$table} is missing");
        }
    }

    public function test_a_part_moves_queued_running_draining_ended_and_never_skips_to_ended(): void
    {
        $part = $this->part();

        $part->start(4242, 'host-a');
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();

        $this->assertSame(LifecycleState::Ended, $part->refresh()->lifecycle);
        $this->expectException(PartTransitionRefused::class);
        $this->part('second')->finishDraining();
    }

    public function test_a_part_with_an_exit_but_undrained_streams_is_not_ended(): void
    {
        $part = $this->part();
        $part->start(1, 'host-a');

        $part->finishProcess(PartEnd::exited(1));

        $this->assertSame(LifecycleState::Draining, $part->refresh()->lifecycle);
        $this->assertFalse($part->streams_drained);
    }

    public function test_a_signalled_part_has_no_status_code(): void
    {
        $part = $this->part();
        $part->start(1, 'host-a');

        $part->finishProcess(PartEnd::signalled(9));

        $end = $part->refresh()->end();
        $this->assertSame(PartEndType::Signalled, $end->type);
        $this->assertFalse($end->hasStatus());
    }

    public function test_a_repeated_event_is_kept_once_and_a_conflicting_one_is_an_operational_error(): void
    {
        $run = $this->admittedRun();

        ProcessEvent::record($run, 1, 'part_started', ['part' => 'a']);
        ProcessEvent::record($run, 1, 'part_started', ['part' => 'a']);
        $conflict = ProcessEvent::record($run, 1, 'part_ended', ['part' => 'a']);

        $this->assertSame(2, $run->events()->count());
        $this->assertSame(ProcessEvent::OPERATIONAL_ERROR, $conflict->type);
        $this->assertSame(1, $conflict->payload['conflicts_with']);
    }

    public function test_an_evidence_run_never_answers(): void
    {
        $this->assertFalse($this->admittedRun(RunMode::Evidence)->mayAnswer());
        $this->assertTrue($this->admittedRun(RunMode::Normal, 'admission-2')->mayAnswer());
    }

    private function admittedRun(RunMode $mode = RunMode::Normal, string $admission = 'admission-1'): ProcessRun
    {
        return ProcessRun::admit(ActorIdentity::system(), TestRunAdmissions::of(admissionId: $admission, mode: $mode));
    }

    private function part(string $partId = 'first'): PartRun
    {
        $run = $this->admittedRun(RunMode::Normal, "admission-{$partId}");

        return PartRun::queue($run, new PartKey(1, 1, 'core.ls'));
    }
}
