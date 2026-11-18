<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\Denied;
use App\Hooks\Decisions\PushState;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SimpleTransition;
use App\Hooks\Exceptions\ConflictingStackTransition;
use App\Hooks\Exceptions\EmptyReason;
use PHPUnit\Framework\TestCase;

final class DecisionTest extends TestCase
{
    public function test_each_named_constructor_gives_its_answer(): void
    {
        $this->assertSame('delegate', Decision::delegate()->answerType()->value);
        $this->assertSame('allow', Decision::allow()->answerType()->value);
        $this->assertSame('deny', Decision::deny('Save the test run first.')->answerType()->value);
        $this->assertSame('deny', Decision::deny('Task 3 is still open.')->answerType()->value);
        $this->assertSame('rewrite', Decision::rewrite('journal run tests')->answerType()->value);
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $denied = Decision::deny('Save the test run first.')->answer;

        $this->assertInstanceOf(Denied::class, $denied);
        $this->assertSame('Save the test run first.', $denied->reason()->text);
    }

    public function test_a_reason_is_never_empty(): void
    {
        $this->expectException(EmptyReason::class);

        Decision::deny('   ');
    }

    public function test_context_and_push_and_pop_delegate(): void
    {
        $reference = new StateReference('tasks.working', new SubjectReference('3', 1));

        $this->assertTrue(Decision::addContext('Remember rule 7.')->isDelegating());
        $this->assertTrue(Decision::push($reference)->isDelegating());
        $this->assertTrue(Decision::pop()->isDelegating());
        $this->assertSame(SimpleTransition::PopSelf, Decision::pop()->transition);
    }

    public function test_a_push_carries_its_state(): void
    {
        $reference = new StateReference('chat.answering', NoSubject::None);
        $change = Decision::push($reference)->transition;

        $this->assertInstanceOf(PushState::class, $change);
        $this->assertSame($reference, $change->state);
    }

    public function test_adding_context_returns_a_new_decision_and_keeps_the_old_one(): void
    {
        $first = Decision::addContext('One.');
        $second = $first->withContext('Two.');

        $this->assertSame(['One.'], $first->context);
        $this->assertSame(['One.', 'Two.'], $second->context);
        $this->assertSame(SimpleTransition::Keep, $second->transition);
    }

    public function test_a_decision_makes_only_one_stack_change(): void
    {
        $this->expectException(ConflictingStackTransition::class);

        Decision::pop()->withPush(new StateReference('tasks.working', NoSubject::None));
    }
}
