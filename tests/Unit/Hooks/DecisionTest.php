<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Domain\Hooks\Decisions\ConflictingStackChange;
use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Decisions\Denied;
use App\Domain\Hooks\Decisions\EmptyReason;
use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\PushState;
use App\Domain\Hooks\Decisions\SimpleChange;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Decisions\StopPrevented;
use App\Domain\Hooks\Decisions\SubjectReference;
use PHPUnit\Framework\TestCase;

final class DecisionTest extends TestCase
{
    public function test_each_named_constructor_gives_its_answer(): void
    {
        $this->assertSame('delegate', Decision::delegate()->answerKind()->value);
        $this->assertSame('allow', Decision::allow()->answerKind()->value);
        $this->assertSame('deny', Decision::deny('Save the test run first.')->answerKind()->value);
        $this->assertSame('prevent_stop', Decision::preventStop('Task 3 is still open.')->answerKind()->value);
        $this->assertSame('rewrite', Decision::rewrite('journal run tests')->answerKind()->value);
    }

    public function test_a_denial_and_a_held_stop_carry_their_reason(): void
    {
        $denied = Decision::deny('Save the test run first.')->answer;
        $held = Decision::preventStop('Task 3 is still open.')->answer;

        $this->assertInstanceOf(Denied::class, $denied);
        $this->assertSame('Save the test run first.', $denied->reason->text);
        $this->assertInstanceOf(StopPrevented::class, $held);
        $this->assertSame('Task 3 is still open.', $held->reason->text);
    }

    public function test_a_reason_is_never_empty(): void
    {
        $this->expectException(EmptyReason::class);

        Decision::deny('   ');
    }

    public function test_context_and_push_and_pop_delegate(): void
    {
        $reference = new StateReference('tasks.working', new SubjectReference(3, 1));

        $this->assertTrue(Decision::addContext('Remember rule 7.')->isDelegating());
        $this->assertTrue(Decision::push($reference)->isDelegating());
        $this->assertTrue(Decision::pop()->isDelegating());
        $this->assertSame(SimpleChange::PopSelf, Decision::pop()->change);
    }

    public function test_a_push_carries_its_state(): void
    {
        $reference = new StateReference('chat.answering', NoSubject::None);
        $change = Decision::push($reference)->change;

        $this->assertInstanceOf(PushState::class, $change);
        $this->assertSame($reference, $change->state);
    }

    public function test_adding_context_returns_a_new_decision_and_keeps_the_old_one(): void
    {
        $first = Decision::addContext('One.');
        $second = $first->withContext('Two.');

        $this->assertSame(['One.'], $first->context);
        $this->assertSame(['One.', 'Two.'], $second->context);
        $this->assertSame(SimpleChange::Keep, $second->change);
    }

    public function test_a_decision_makes_only_one_stack_change(): void
    {
        $this->expectException(ConflictingStackChange::class);

        Decision::pop()->withPush(new StateReference('tasks.working', NoSubject::None));
    }
}
