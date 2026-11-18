<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Commands\AssessPartOutput;
use App\Processes\Commands\ReplayAssessment;
use App\Processes\Enums\InterpretationState;
use App\Processes\Enums\PositionPurpose;
use App\Processes\Enums\RunMode;
use App\Processes\Exceptions\ReplayRefused;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ReaderPosition;
use App\Processes\Models\ResultReceipt;
use App\Processes\Readers\ActivityProjection;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A check's part is read live by its approved reader, a broken reader fails alone while capture goes on, and a
 * finished normal part is replayed into a new assessment without running anything again (doc 21 revision 6,
 * sections 54, 69, 70 and 74; stories 162, 188, 195, 198 and 205).
 */
final class ReaderReplayTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedCalls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
        $this->approvePair();
    }

    public function test_a_part_is_read_live_into_a_provisional_position(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);

        $position = $this->livePosition($part);
        $this->assertSame(InterpretationState::Provisional, $position->interpretation);
        $this->assertSame(['stdout' => strlen(self::PASSED_OUTPUT)], $position->checkpoint()->offsets);
    }

    public function test_an_oversized_record_fails_the_reader_alone_and_capture_goes_on(): void
    {
        $part = $this->normalRun(0, str_repeat('x', 70_000)."\n".self::PASSED_OUTPUT);

        $this->assertSame(InterpretationState::ReaderFailed, $this->livePosition($part)->interpretation);
        $activity = $this->app->make(ActivityProjection::class)->ofPart($part->refresh());
        $this->assertSame(70_001 + strlen(self::PASSED_OUTPUT), $activity->bytes['stdout']);
    }

    public function test_a_replay_appends_a_linked_assessment_and_runs_nothing_again(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $first = $this->asAgent(new AssessPartOutput($part->id));
        $runs = ProcessRun::query()->withoutGlobalScopes()->count();

        $second = $this->asUser(new ReplayAssessment($part->id));

        $assessments = OutputAssessment::query()
            ->where('part_run_id', $part->id)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
        $this->assertSame($assessments[0]->id, $assessments[1]->replaces_assessment_id);
        $this->assertSame($second, ResultReceipt::query()->findOrFail($first)->superseded_by_id);
        $this->assertSame($runs, ProcessRun::query()->withoutGlobalScopes()->count());
        $this->assertSame(1, PartRun::query()->where('process_run_id', $part->process_run_id)->count());
    }

    public function test_an_evidence_run_and_an_unended_part_are_not_replayed(): void
    {
        $evidence = $this->normalRun(0, self::PASSED_OUTPUT, RunMode::Evidence);
        $this->assertThrows(fn () => $this->asUser(new ReplayAssessment($evidence->id)), ReplayRefused::class);

        $running = PartRun::query()->create([
            'process_run_id' => $evidence->process_run_id,
            'syntax_node' => 2,
            'part_id' => 'node-2',
            'attempt' => 1,
            'operation' => 'acme verify',
        ]);
        $this->assertThrows(fn () => $this->asUser(new ReplayAssessment($running->id)), ReplayRefused::class);
    }

    private function livePosition(PartRun $part): ReaderPosition
    {
        return ReaderPosition::query()
            ->where('part_run_id', $part->id)
            ->where('purpose', PositionPurpose::Live->value)
            ->sole();
    }
}
