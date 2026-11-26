<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Events\Sessions\SessionStartEnded;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent cancels a job of its helper, which marks it cancelled.
 */
#[TestsCommand(CancelHelperJobCommand::class)]
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class CancelHelperJobTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    public function test_a_cancel_marks_an_unfinished_job_cancelled(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');
        $this->endAttempt($receipt);

        $this->commands()->run(new CancelHelperJobCommand($receipt->jobId, 'cancel-1'));

        $this->assertSame(JobStatus::Cancelled, HelperJob::query()->findOrFail($receipt->jobId)->status);
    }

    private function endAttempt(HelperReceipt $receipt): void
    {
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new SessionStartEnded($job->assignmentIdentity()));
    }

    private function commands(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
