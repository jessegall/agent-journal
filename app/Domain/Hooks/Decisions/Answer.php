<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Decisions;

/**
 * What a state answers to a hook: delegate, allow, deny, prevent the stop or rewrite.
 */
interface Answer
{
    public function label(): string;
}
