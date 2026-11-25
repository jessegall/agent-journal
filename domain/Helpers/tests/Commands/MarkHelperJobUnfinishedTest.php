<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Events\Sessions\SessionStartEnded;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An attempt that ended leaves its open job unfinished, with a notice that holds the exact continue command.
 */
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class MarkHelperJobUnfinishedTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    public function test_an_ended_attempt_leaves_the_job_unfinished_with_a_complete_continue_command(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $this->endAttempt($receipt);

        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $notice = HelperNotice::query()->sole();
        $this->assertSame(JobStatus::Unfinished, $job->status);

        $this->assertStringContainsString(
            sprintf("helpers_continue with identity_id '%s', job_id '%s' and model '", $receipt->identityId, $receipt->jobId),
            $notice->text,
        );
    }

    private function endAttempt(HelperReceipt $receipt): void
    {
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new SessionStartEnded($job->assignmentIdentity()));
    }
}
