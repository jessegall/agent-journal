<?php

declare(strict_types=1);

namespace App\Hooks\Support;

/**
 * How many characters of reminders a context start may carry beyond the required ones (config hooks.context_budget_characters).
 */
final readonly class ContextBudget
{
    public function __construct(public int $characters) {}
}
