<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Hooks\Actions\PruneHookHistory;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\HookIdentityExpired;
use App\Hooks\Exceptions\RetentionTooShort;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Storage\RecordedAnswer;
use App\Hooks\Storage\RecordedSteps;
use App\Hooks\Support\HookRetryWindow;
use App\Hooks\Support\RetentionPeriods;
use App\Hooks\Support\StackAccess;
use App\Links\Models\Link;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

final class HookRetentionTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        CarbonImmutable::setTestNow('2026-11-01 08:00:00');
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_calls_past_seven_days_go_and_newer_calls_stay(): void
    {
        $this->stack(new StackTarget(TestIds::of(1), TestIds::of(10)));
        $this->recordCall(new StackTarget(TestIds::of(1), TestIds::of(10)), 'old');
        $this->moveDays(5);
        $this->recordCall(new StackTarget(TestIds::of(1), TestIds::of(10)), 'recent');
        $this->moveDays(3);

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame(1, $pruned->hookCalls);
        $this->assertSame(['recent'], HookCall::query()->authorizedFor(new StackTarget(TestIds::of(1), TestIds::of(10)))->pluck('event_id')->all());
    }

    public function test_closed_stacks_past_thirty_days_go_and_active_or_recently_closed_stacks_stay(): void
    {
        $this->stack(new StackTarget(TestIds::of(1), TestIds::of(10)))->closeAt(CarbonImmutable::now());
        $this->stack(new StackTarget(TestIds::of(2), TestIds::of(20)));
        $this->moveDays(25);
        $this->stack(new StackTarget(TestIds::of(3), TestIds::of(30)))->closeAt(CarbonImmutable::now());
        $this->moveDays(6);

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame(1, $pruned->closedStacks);
        $this->assertFalse(AgentStackRow::query()->authorizedFor(new StackTarget(TestIds::of(1), TestIds::of(10)))->exists());
        $this->assertTrue(AgentStackRow::query()->authorizedFor(new StackTarget(TestIds::of(2), TestIds::of(20)))->exists());
        $this->assertTrue(AgentStackRow::query()->authorizedFor(new StackTarget(TestIds::of(3), TestIds::of(30)))->exists());
    }

    public function test_a_held_stack_and_its_calls_outlive_their_retention(): void
    {
        $held = $this->stack(new StackTarget(TestIds::of(1), TestIds::of(10)));
        $this->recordCall(new StackTarget(TestIds::of(1), TestIds::of(10)), 'held call');
        $held->closeAt(CarbonImmutable::now());
        $held->holdForInvestigation(CarbonImmutable::now());
        $this->moveDays(40);

        $pruned = $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame([0, 0], [$pruned->hookCalls, $pruned->closedStacks]);
        $this->assertTrue(AgentStackRow::query()->authorizedFor(new StackTarget(TestIds::of(1), TestIds::of(10)))->exists());
        $this->assertSame(1, HookCall::query()->authorizedFor(new StackTarget(TestIds::of(1), TestIds::of(10)))->count());
    }

    public function test_a_pruned_call_cannot_come_back_as_a_fresh_call(): void
    {
        $this->stack(new StackTarget(TestIds::of(1), TestIds::of(10)));
        $issuedAt = CarbonImmutable::now();
        $this->recordCall(new StackTarget(TestIds::of(1), TestIds::of(10)), 'call-7');
        $this->moveDays(8);
        $this->app->make(PruneHookHistory::class)->prune();
        $this->app->instance(AgentContext::class, new AgentContext(TestIds::of(1), TestIds::of(10), 'hooks.main_ready', new SignedCall('call-7', $issuedAt, str_repeat('a', 64)), null));

        $this->expectException(HookIdentityExpired::class);

        $this->app->make(StackAccess::class)->hookIdentity();
    }

    public function test_pruning_removes_the_links_of_what_it_removes(): void
    {
        $stack = $this->stack(new StackTarget(TestIds::of(1), TestIds::of(10)));
        $stack->linkTo($this->recordCall(new StackTarget(TestIds::of(1), TestIds::of(10)), 'old'));
        $this->moveDays(8);

        $this->app->make(PruneHookHistory::class)->prune();

        $this->assertSame(0, Link::query()->count());
    }

    public function test_a_call_retention_a_retry_could_outlive_is_refused(): void
    {
        $this->expectException(RetentionTooShort::class);

        (new RetentionPeriods(hookCallDays: 0))->checkLongerThan(new HookRetryWindow(300));
    }

    public function test_the_command_prunes_in_batches_and_says_how_much(): void
    {
        $this->app->instance(RetentionPeriods::class, new RetentionPeriods(batchSize: 2));
        $this->stack(new StackTarget(TestIds::of(1), TestIds::of(10)));
        foreach (['a', 'b', 'c', 'd', 'e'] as $hookId) {
            $this->recordCall(new StackTarget(TestIds::of(1), TestIds::of(10)), $hookId);
        }
        $this->moveDays(8);

        $this->artisan('hooks:prune')->expectsOutput('Removed 5 hook calls and 0 closed stacks.')->assertSuccessful();
    }

    private function stack(StackTarget $target): AgentStackRow
    {
        $row = new AgentStackRow;
        $row->startFor($target, new FrameRecords([new FrameRecord('ready', new StateReference('hooks.main_ready', NoSubject::None), true, 1)]));

        return $row;
    }

    private function recordCall(StackTarget $target, string $hookId): HookCall
    {
        $call = new HookCall;
        $call->recordFor(new HookIdentity($target->agentId, $target->sessionId, $hookId, str_repeat('a', 64)), RecordedAnswer::of(AnswerType::Allow, '{}'), RecordedSteps::of([]));

        return $call;
    }

    private function moveDays(int $days): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addDays($days));
        $this->travelTo(CarbonImmutable::now());
    }
}
