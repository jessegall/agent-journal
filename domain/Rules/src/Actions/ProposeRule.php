<?php

declare(strict_types=1);

namespace Domain\Rules\Actions;

use Domain\Rules\Models\Rule;

/**
 * Proposes a rule with its text; the text stays as proposed, and the rule holds only once the owner approves it.
 */
final readonly class ProposeRule
{
    public function propose(string $text): Rule
    {
        return Rule::proposed($text);
    }
}
