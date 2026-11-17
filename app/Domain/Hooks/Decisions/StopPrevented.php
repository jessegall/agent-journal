<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

final readonly class StopPrevented implements Answer
{
    public function __construct(public Reason $reason) {}

    public function kind(): AnswerKind
    {
        return AnswerKind::PreventStop;
    }
}
