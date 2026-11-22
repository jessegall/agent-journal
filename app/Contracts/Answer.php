<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\AnswerType;

/**
 * What a state answers to a hook: delegate, allow, deny, prevent the stop or rewrite.
 */
interface Answer
{
    public function type(): AnswerType;
}
