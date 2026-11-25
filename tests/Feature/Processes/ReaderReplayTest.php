<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\Runs\AssessPartOutput\AssessPartOutputCommand;
use App\Commands\Runs\ReplayAssessment\ReplayAssessmentCommand;
use App\Enums\Runs\InterpretationState;
use App\Enums\Runs\PositionPurpose;
use App\Enums\Runs\RunMode;
use App\Exceptions\ReplayRefused;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ReaderPosition;
use App\Models\Runs\ResultReceipt;
use App\Resolvers\Support\ActivityProjection;
use App\Values\PartKey;
use Tests\Support\Processes\StartsWithApprovedAcmePair;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * A check's part is read live by its approved reader, a broken reader fails alone while capture goes on, and a
 * finished normal part is replayed into a new assessment without running anything again.
 */
final class ReaderReplayTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedPayloads;
    use StartsWithApprovedAcmePair;

    public function test_a_part_is_read_live_into_a_provisional_position(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);

        $position = $this->livePosition($part);
        $this->assertSame(InterpretationState::Provisional, $position->interpretation);
        $this->assertSame(['stdout' => strlen(self::PASSED_OUTPUT)], $position->checkpoint->offsets);
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
        $first = $this->runAsAgent(new AssessPartOutputCommand($part->id));
        $runs = ProcessRun::query()->withoutGlobalScopes()->count();

        $second = $this->asUser(new ReplayAssessmentCommand($part->id));

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
        $this->assertThrows(fn () => $this->asUser(new ReplayAssessmentCommand($evidence->id)), ReplayRefused::class);

        $running = PartRun::create(
            ProcessRun::query()->withoutGlobalScopes()->findOrFail($evidence->process_run_id),
            new PartKey(2, 1, 'acme verify'),
        );
        $this->assertThrows(fn () => $this->asUser(new ReplayAssessmentCommand($running->id)), ReplayRefused::class);
    }

    private function livePosition(PartRun $part): ReaderPosition
    {
        return ReaderPosition::query()
            ->where('part_run_id', $part->id)
            ->where('purpose', PositionPurpose::Live->value)
            ->sole();
    }
}
