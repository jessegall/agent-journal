<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Enums\AnswerType;
use App\Exceptions\NoRefusalReason;
use App\Exceptions\NoReplacementLine;
use App\Support\Decisions\Decision;
use App\Support\Decisions\Denied;
use Tests\Support\TestText;
use Tests\TestCase;

final class DecisionTest extends TestCase
{
    private const string REASON = 'Save the test run first.';

    public function test_each_named_constructor_gives_its_answer(): void
    {
        $this->assertSame(AnswerType::Allow, Decision::allow()->answerType());
        $this->assertSame(AnswerType::Delegate, Decision::delegate()->answerType());
        $this->assertSame(AnswerType::Deny, Decision::deny(TestText::of(self::REASON))->answerType());
        $this->assertSame(AnswerType::Rewrite, Decision::rewrite('journal run tests')->answerType());
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $denied = Decision::deny(TestText::of(self::REASON))->answer;

        $this->assertInstanceOf(Denied::class, $denied);
        $this->assertEquals(TestText::of(self::REASON), $denied->reason()->text);
    }

    public function test_a_rewrite_has_no_refusal_reason(): void
    {
        $this->expectException(NoRefusalReason::class);

        Decision::rewrite('ls')->refusalReason();
    }

    public function test_a_denial_has_no_replacement_line(): void
    {
        $this->expectException(NoReplacementLine::class);

        Decision::deny(TestText::of(self::REASON))->replacementLine();
    }
}
