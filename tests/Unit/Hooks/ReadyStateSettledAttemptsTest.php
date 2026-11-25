<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Enums\Sessions\StopCheckState;
use App\Events\Sessions\StopCheckSettled;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\States\ReadyState;
use App\Values\SettledStopChecks;
use Tests\Fixtures\Hooks\CountingStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\TestCase;

/**
 * The ready state keeps the outcomes of the stop attempts it opened, in the order it opened them even when their
 * results come back out of order, and hears no attempt of another stack.
 */
final class ReadyStateSettledAttemptsTest extends TestCase
{
    public function test_unchanged_failures_are_counted_in_the_order_the_attempts_were_opened(): void
    {
        $gate = new CountingStops();
        $ready = new ReadyState(new FixedOperationPolicy(), $gate);

        foreach (['attempt-1', 'attempt-2', 'attempt-3'] as $attempt) {
            $ready->onStop($this->stop($attempt));
        }

        $ready->onStopCheckSettled(new StopCheckSettled('attempt-3', StopCheckState::Failed, 'same'));
        $ready->onStopCheckSettled(new StopCheckSettled('attempt-1', StopCheckState::Failed, 'other'));
        $ready->onStopCheckSettled(new StopCheckSettled('attempt-2', StopCheckState::Failed, 'same'));
        $ready->onStop($this->stop('attempt-4'));

        $this->assertSame(2, $gate->lastSettled->unchangedBefore('attempt-4', 'same'));
        $this->assertSame(0, $gate->lastSettled->unchangedBefore('attempt-4', 'other'));
    }

    public function test_an_attempt_the_stack_did_not_open_is_not_kept(): void
    {
        $gate = new CountingStops();
        $ready = new ReadyState(new FixedOperationPolicy(), $gate);
        $ready->onStop($this->stop('attempt-1'));

        $ready->onStopCheckSettled(new StopCheckSettled('elsewhere', StopCheckState::Failed, 'same'));
        $ready->onStopCheckSettled(new StopCheckSettled('attempt-1', StopCheckState::Failed, 'same'));
        $ready->onStop($this->stop('attempt-2'));

        $this->assertSame(1, $gate->lastSettled->unchangedBefore('attempt-2', 'same'));
    }

    public function test_a_different_outcome_ends_the_run(): void
    {
        $settled = new SettledStopChecks(['attempt-1' => 'same', 'attempt-2' => 'other', 'attempt-3' => 'same']);

        $this->assertSame(1, $settled->unchangedBefore('attempt-4', 'same'));
    }

    private function stop(string $stopId): StopRequested
    {
        return new StopRequested(
            new HookIdentity('agent', 'session', $stopId, 'digest'),
            new StopDetails('turn', false, ''),
        );
    }
}
