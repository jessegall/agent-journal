<?php

declare(strict_types=1);

namespace App\Contracts\Asks;

use App\Enums\Hooks\AnswerType;

/**
 * What a state answers to a hook: delegate, allow, deny, prevent the stop or rewrite.
 */
interface Answer
{
    /**
     * Whether the answer allows, denies, rewrites or passes on.
     */
    public function type(): AnswerType;
}
