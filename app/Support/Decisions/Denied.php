<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Contracts\Chat\Answer;
use App\Enums\AnswerType;

/**
 * An answer that refuses with a reason the agent reads: a denied tool, prompt or stop.
 */
final readonly class Denied implements Answer
{
    public function __construct(private Reason $reason) {}

    public function reason(): Reason
    {
        return $this->reason;
    }

    public function type(): AnswerType
    {
        return AnswerType::Deny;
    }
}
