<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Events\Sessions\SessionStartEnded;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperMessage;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent steers its helper: the words reach the live job, and with none live they are kept as a message with the
 * command that continues it.
 */
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
#[TestsCommand(SteerHelperCommand::class)]
final class SteerHelperTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string CONTINUE_CALL = 'helpers_continue with';

    public function test_a_steer_adds_to_the_live_job_and_is_kept_when_none_is_live(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $steered = $this->commands()->run(new SteerHelperCommand($receipt->identityId, 'Look at the tests too'));
        $this->endAttempt($receipt);
        $kept = $this->commands()->run(new SteerHelperCommand($receipt->identityId, 'And the docs'));

        $this->assertSame($receipt->jobId, $steered->jobId);
        $this->assertSame(['Look at the tests too'], HelperJob::query()->findOrFail($receipt->jobId)->steering);
        $this->assertSame($kept->messageId, HelperMessage::query()->sole()->id);
        $this->assertStringContainsString(self::CONTINUE_CALL, (string) $kept->suggestedCommand);
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
