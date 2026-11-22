<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\Denied;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Exceptions\EmptyReason;
use App\Hooks\Exceptions\NoRefusalReason;
use App\Hooks\Exceptions\NoReplacementLine;
use PHPUnit\Framework\TestCase;

final class DecisionTest extends TestCase
{
    private const string REASON = 'Save the test run first.';

    public function test_each_named_constructor_gives_its_answer(): void
    {
        $this->assertSame(AnswerType::Allow, Decision::allow()->answerType());
        $this->assertSame(AnswerType::Deny, Decision::deny(self::REASON)->answerType());
        $this->assertSame(AnswerType::Rewrite, Decision::rewrite('journal run tests')->answerType());
    }

    public function test_a_denial_carries_its_reason(): void
    {
        $denied = Decision::deny(self::REASON)->answer;

        $this->assertInstanceOf(Denied::class, $denied);
        $this->assertSame(self::REASON, $denied->reason()->text);
    }

    public function test_a_reason_is_never_empty(): void
    {
        $this->expectException(EmptyReason::class);

        Decision::deny('   ');
    }

    public function test_a_rewrite_has_no_refusal_reason(): void
    {
        $this->expectException(NoRefusalReason::class);

        Decision::rewrite('ls')->refusalReason();
    }

    public function test_a_denial_has_no_replacement_line(): void
    {
        $this->expectException(NoReplacementLine::class);

        Decision::deny(self::REASON)->replacementLine();
    }
}
