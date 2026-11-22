<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * A state type that may be switched off as a whole, so none of its states runs or is pushed while it is. It answers
 * fresh each time it is asked.
 */
interface ConditionalStateType
{
    public function isEnabled(): bool;
}
