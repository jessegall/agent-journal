<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\ReminderContribution;

/**
 * The reminders the owning domains give an agent when its context starts again: every required one first, then the
 * others in the order added while the budget lasts, then one line saying how many were left out and how to read
 * them. Nothing stored is deleted.
 */
final class ContextReminders implements ReminderContribution
{
    /**
     * @var list<string>
     */
    private array $required = [];

    /**
     * @var list<string>
     */
    private array $others = [];

    public function __construct(private readonly ContextBudget $budget) {}

    public function add(string $reminder, bool $required): void
    {
        if ($required) {
            $this->required[] = $reminder;

            return;
        }

        $this->others[] = $reminder;
    }

    /**
     * @return list<string>
     */
    public function all(): array
    {
        $given = $this->required;
        $left = $this->budget->characters;
        $omitted = 0;

        foreach ($this->others as $reminder) {
            if (mb_strlen($reminder) > $left) {
                $omitted++;

                continue;
            }

            $given[] = $reminder;
            $left -= mb_strlen($reminder);
        }

        return $omitted === 0 ? $given : [
            ...$given,
            "{$omitted} more reminders did not fit this context; read your memories with journal memory list.",
        ];
    }
}
