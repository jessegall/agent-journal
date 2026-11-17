<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use App\Core\Hooks\Contracts\Refusal;
use App\Core\Hooks\Enums\AnswerKind;

final readonly class Denied implements Refusal
{
    public function __construct(private Reason $reason) {}

    public function reason(): Reason
    {
        return $this->reason;
    }

    public function kind(): AnswerKind
    {
        return AnswerKind::Deny;
    }
}
