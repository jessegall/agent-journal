<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;

/**
 * One hook call of an agent program, in the journal's own words; it asks a state for the matching answer.
 */
interface HookInput
{
    public function identity(): HookIdentity;

    public function methodName(): string;

    /**
     * Whether this hook can take an answer of that kind: only a stop can be prevented, only a shell command rewritten.
     */
    public function accepts(AnswerKind $kind): bool;

    public function answerBy(HookAnswerer $state): Decision;
}
