<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Exceptions\NoRefusalReason;
use App\Exceptions\NoReplacementLine;
use App\Hooks\Enums\AnswerType;
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
        $reason = TestText::of(self::REASON);
        $denied = Decision::deny($reason)->answer;

        $this->assertInstanceOf(Denied::class, $denied);
        $this->assertSame($reason, $denied->reason()->text);
    }

    public function test_a_registered_text_key_becomes_the_denial_reason(): void
    {
        $decision = Decision::deny('core.messages.closing_words_offer');

        $this->assertSame('core.messages.closing_words_offer', $decision->refusalReason()->key);
        $this->assertSame([], $decision->refusalReason()->values);
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
