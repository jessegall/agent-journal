<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Agents\Drivers\Capabilities\CodexHeadlessCapabilities;
use App\Bus\Contracts\CommandBus;
use App\Events\Sessions\SessionStartEnded;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Sessions\SessionRequest;
use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Exceptions\HelperJobAlreadyEnded;
use Domain\Helpers\Exceptions\HelperStartUncertain;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent continues an unfinished job: it keeps the job and brief on the model named now and a repeat finds the
 * same job; a driver that cannot reopen a conversation refuses by its reason, a finished job refuses with a send
 * command and a live one as uncertain.
 */
#[TestsCommand(ContinueHelperCommand::class)]
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class ContinueHelperTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string BRIEF = 'Review it.';

    private const string SEND_CALL = "helpers_send with identity_id '%s'";

    /**
     * A driver that reopens an earlier conversation; Codex headless cannot yet.
     */
    private const string RESUMING_DRIVER = 'claude-code';

    private const string CODEX = 'codex';

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
        $this->assertSame(JobStatus::Running, $job->status);
        $this->assertSame(self::BRIEF, $job->brief);
        $this->assertSame(2, SessionRequest::query()->where('owner_reference', 'like', '%'.$receipt->jobId)->count());
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

        $this->assertThrows(fn () => $this->continueJob($receipt, (string) Str::ulid()), HelperStartUncertain::class);

        HelperJob::query()->findOrFail($receipt->jobId)->finish('report:1');

        $this->assertThrows(
            fn () => $this->continueJob($receipt, (string) Str::ulid()),
            HelperJobAlreadyEnded::class,
            sprintf(self::SEND_CALL, $receipt->identityId),
        );
    }

    private function endAttempt(HelperReceipt $receipt): void
    {
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new SessionStartEnded($job->assignmentIdentity()));
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
