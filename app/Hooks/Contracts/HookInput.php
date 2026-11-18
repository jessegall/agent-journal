<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Inputs\HookIdentity;

/**
 * One hook call of an agent program, in the journal's own words; it asks a state for the matching answer.
 */
interface HookInput
{
    public function identity(): HookIdentity;

    public function methodName(): string;

    /**
     * Whether this hook can take an answer of that type: only a stop can be prevented, only a shell command rewritten.
     */
    public function accepts(AnswerType $type): bool;

    public function answerBy(HookAnswerer $state): Decision;
}
