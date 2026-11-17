<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

/**
 * What a state answers to a hook: delegate, allow, deny, prevent the stop or rewrite.
 */
interface Answer
{
    public function kind(): AnswerKind;
}
