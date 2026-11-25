<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use Domain\Helpers\Commands\HoldHelperJob\HoldHelperJobCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A stop that failed its checks holds the open job for repair with its evidence and tells the parent which helper
 * and job wait; a job that already ended is left as it was.
 */
final class HoldHelperJobTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_open_job_is_held_with_its_evidence_and_the_parent_is_told(): void
    {
        $job = $this->openHelperJob();

        $this->runLifecycleCommand(new HoldHelperJobCommand($job->id, 'stop-attempt:attempt-2'));

        $held = HelperJob::query()->acrossActors()->findOrFail($job->id);
        $this->assertSame([JobStatus::Held, 'stop-attempt:attempt-2'], [$held->status, $held->stop_evidence_reference]);
        $this->assertStringContainsString($job->id, HelperNotice::query()->acrossActors()->sole()->text);
    }

    public function test_a_job_that_already_ended_is_left_as_it_was_and_nobody_is_told(): void
    {
        $job = $this->openHelperJob();
        $job->cancel();

        $this->runLifecycleCommand(new HoldHelperJobCommand($job->id, 'stop-attempt:attempt-2'));

        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->acrossActors()->findOrFail($job->id)->status);
        $this->assertSame(0, HelperNotice::query()->acrossActors()->count());
    }
}
