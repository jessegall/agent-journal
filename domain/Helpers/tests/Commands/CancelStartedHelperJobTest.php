<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use Domain\Helpers\Commands\CancelStartedHelperJob\CancelStartedHelperJobCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Domain\Helpers\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A start that was cancelled cancels its open job; a job that already finished keeps its end.
 */
final class CancelStartedHelperJobTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_open_job_whose_start_was_cancelled_is_cancelled(): void
    {
        $helpers = $this->journal->owner()->fixtures(HelperFixtures::class)->openJob('Fix', 'Owner');
        $job = $helpers->jobCalled('Fix');

        $helpers->runLifecycle(new CancelStartedHelperJobCommand($job->id));

        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->acrossActors()->findOrFail($job->id)->status);
    }

    public function test_a_finished_job_keeps_its_end(): void
    {
        $helpers = $this->journal->owner()->fixtures(HelperFixtures::class)->openJob('Fix', 'Owner');
        $job = $helpers->jobCalled('Fix');
        $job->finish('report:1');

        $helpers->runLifecycle(new CancelStartedHelperJobCommand($job->id));

        $this->assertSame(JobStatus::Finished, HelperJob::query()->acrossActors()->findOrFail($job->id)->status);
    }
}
