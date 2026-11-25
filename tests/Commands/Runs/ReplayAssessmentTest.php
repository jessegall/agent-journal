<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\AssessPartOutput\AssessPartOutputCommand;
use App\Commands\Runs\ReplayAssessment\ReplayAssessmentCommand;
use App\Enums\Runs\RunMode;
use App\Exceptions\ReplayRefused;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ResultReceipt;
use App\Values\PartKey;
use Tests\Support\Processes\StartsWithApprovedAcmePair;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * A replay of an ended part appends a linked assessment and runs nothing again; an evidence run and an unended part
 * are not replayed.
 */
final class ReplayAssessmentTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedPayloads;
    use StartsWithApprovedAcmePair;

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
}
