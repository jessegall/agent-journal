<?php

declare(strict_types=1);

namespace App\Processes\Rules;

use App\Processes\Values\CommandRule;

/**
 * Core's built-in command rules, active from the start; the families are declared by the classification tasks of
 * plan 14 phase 70.
 */
final readonly class CoreRules
{
    /**
     * @return list<CommandRule>
     */
    public function all(): array
    {
        return [];
    }
}
