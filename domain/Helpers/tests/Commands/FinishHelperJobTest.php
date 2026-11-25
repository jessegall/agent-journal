<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use Domain\Helpers\Commands\FinishHelperJob\FinishHelperJobCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A certified stop finishes the open job with its evidence and time; a job that already ended is left as it was.
 */
final class FinishHelperJobTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_open_job_finishes_with_its_evidence_and_time(): void
    {
        $job = $this->openHelperJob();

        $this->runLifecycleCommand(new FinishHelperJobCommand($job->id, 'stop-attempt:attempt-1'));

        $finished = HelperJob::query()->acrossActors()->findOrFail($job->id);
        $this->assertSame(
            [JobStatus::Finished, 'stop-attempt:attempt-1'],
            [$finished->status, $finished->stop_evidence_reference],
        );
        $this->assertNotNull($finished->finished_at);
    }

    public function test_a_job_that_already_ended_is_left_as_it_was(): void
    {
        $job = $this->openHelperJob();
        $job->cancel();

        $this->runLifecycleCommand(new FinishHelperJobCommand($job->id, 'stop-attempt:attempt-3'));

        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->acrossActors()->findOrFail($job->id)->status);
    }
}
