<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Events\LaunchEnded;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Starts\StartRecord;
use App\Support\Capabilities\CodexHeadlessCapabilities;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperJobAlreadyEnded;
use Domain\Helpers\Exceptions\HelperLaunchUncertain;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperMessage;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent continues, steers and cancels its helper jobs as commands: an ended attempt leaves the job
 * unfinished with a notice that holds the exact continue command, a continue keeps the job and brief on the model
 * named now, a finished job refuses with a send command, a steer changes no selection, and a cancel marks the job
 * cancelled.
 */
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class HelperContinueTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string BRIEF = 'Review it.';

    private const string SEND_COMMAND = "journal helper send '%s'";

    private const string CONTINUE_COMMAND = 'journal helper continue';

    /**
     * A driver that reopens an earlier conversation; Codex headless cannot yet.
     */
    private const string RESUMING_DRIVER = 'claude-code';

    private const string CODEX = 'codex';

    public function test_an_ended_attempt_leaves_the_job_unfinished_with_a_complete_continue_command(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $this->endAttempt($receipt);

        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $notice = HelperNotice::query()->sole();
        $this->assertSame(JobState::Unfinished, $job->state);

        $this->assertStringContainsString(
            sprintf("journal helper continue '%s' --job '%s' --model '", $receipt->identityId, $receipt->jobId),
            $notice->text,
        );
    }

    public function test_a_continue_keeps_the_job_and_brief_and_starts_on_the_model_named_now(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');
        $this->endAttempt($receipt);
        $this->endSessionOf($receipt);

        $requestId = (string) Str::ulid();

        $continued = $this->continueJob($receipt, $requestId, self::RESUMING_DRIVER);
        $repeated = $this->continueJob($receipt, $requestId, self::RESUMING_DRIVER);

        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->assertSame($receipt->jobId, $continued->jobId);
        $this->assertSame($continued->jobId, $repeated->jobId);
        $this->assertSame(JobState::Accepted, $job->state);
        $this->assertSame(self::BRIEF, $job->brief);
        $this->assertSame(2, StartRecord::query()->where('owner_reference', 'like', '%'.$receipt->jobId)->count());
    }

    public function test_a_continue_on_a_driver_that_cannot_reopen_a_conversation_is_refused_by_its_reason(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');
        $this->endAttempt($receipt);
        $this->endSessionOf($receipt);

        $this->assertThrows(
            fn () => $this->continueJob($receipt, (string) Str::ulid(), self::CODEX),
            DriverCapabilityUnsupported::class,
            CodexHeadlessCapabilities::NO_EXACT_RESUME,
        );
    }

    public function test_a_finished_job_refuses_with_a_send_command_and_a_live_one_as_uncertain(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $this->assertThrows(fn () => $this->continueJob($receipt, (string) Str::ulid()), HelperLaunchUncertain::class);

        HelperJob::query()->findOrFail($receipt->jobId)->finish('report:1');

        $this->assertThrows(
            fn () => $this->continueJob($receipt, (string) Str::ulid()),
            HelperJobAlreadyEnded::class,
            sprintf(self::SEND_COMMAND, $receipt->identityId),
        );
    }

    public function test_a_steer_adds_to_the_live_job_and_is_kept_when_none_is_live(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $steered = $this->commands()->run(new SteerHelperCommand($receipt->identityId, 'Look at the tests too'));
        $this->endAttempt($receipt);
        $kept = $this->commands()->run(new SteerHelperCommand($receipt->identityId, 'And the docs'));

        $this->assertSame($receipt->jobId, $steered->jobId);
        $this->assertSame(['Look at the tests too'], HelperJob::query()->findOrFail($receipt->jobId)->steering);
        $this->assertSame($kept->messageId, HelperMessage::query()->sole()->id);
        $this->assertStringContainsString(self::CONTINUE_COMMAND, (string) $kept->suggestedCommand);
    }

    public function test_a_cancel_marks_an_unfinished_job_cancelled(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');
        $this->endAttempt($receipt);

        $this->commands()->run(new CancelHelperJobCommand($receipt->jobId, 'cancel-1'));

        $this->assertSame(JobState::Cancelled, HelperJob::query()->findOrFail($receipt->jobId)->state);
    }

    private function endAttempt(HelperReceipt $receipt): void
    {
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new LaunchEnded($job->assignmentIdentity()));
    }

    private function continueJob(
        HelperReceipt $receipt,
        string $requestId,
        string|null $driverKey = null,
    ): HelperReceipt {
        return $this->commands()->run(
            new ContinueHelperCommand($requestId, $receipt->identityId, $receipt->jobId, 'default', $driverKey),
        );
    }

    private function commands(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
