<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

use App\Hooks\Contracts\Refusal;
use App\Hooks\Enums\AnswerType;

final readonly class Denied implements Refusal
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
