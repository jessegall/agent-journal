<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\Enums\RetryOutcome;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Bus\ListenerRetries;
use App\Bus\CommittedListenerFailures;
use App\Bus\Values\ListenerRun;
use App\Events\Sessions\AgentRuntimeStartProven;
use App\Jobs\RetryCommittedListener;
use App\Listeners\WakeHostForInstruction;
use App\Models\Drivers\RetryAttempt;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Exceptions;
use RuntimeException;
use Tests\Fixtures\Bus\RetryingStartListener;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsMachinery(ListenerRetries::class)]
final class ListenerRetriesTest extends TestCase
{
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;

    public function test_only_a_marked_listener_is_retried_and_a_repeat_delivery_runs_it_once(): void
    {
        [, $opened] = $this->openRuntime();
        $event = new AgentRuntimeStartProven($opened->runtimeId);
        $listener = $this->app->instance(RetryingStartListener::class, new RetryingStartListener());
        Bus::fake([RetryCommittedListener::class]);
        Exceptions::fake();
        $reports = $this->journal->service(CommittedListenerFailures::class);
        $cause = new RuntimeException('The unmarked listener failed.');
        $unmarked = new ListenerRun(WakeHostForInstruction::class.'@handle', $event);
        $reports->take(CommittedFactListenerFailed::of($event::class, $unmarked->listener, $cause, $unmarked));
        Bus::assertNotDispatched(RetryCommittedListener::class);

        $name = RetryingStartListener::class.'@handle';

        try {
            $listener->handle($event);
        } catch (RuntimeException $failure) {
            $reports->take(CommittedFactListenerFailed::of($event::class, $name, $failure, new ListenerRun($name, $event)));
        }

        Exceptions::assertReported(CommittedFactListenerFailed::class);
        $job = Bus::dispatched(RetryCommittedListener::class)->sole();
        $retries = $this->journal->service(ListenerRetries::class);
        $job->handle($retries);
        $job->handle($retries);

        $attempt = RetryAttempt::query()->ofSession($opened->sessionId)->sole();
        $this->assertSame([5, RetryOutcome::Succeeded, [$opened->runtimeId]], [
            $attempt->wait_seconds,
            $attempt->outcome,
            $listener->heard,
        ]);
    }
}
