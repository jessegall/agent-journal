<?php

declare(strict_types=1);

namespace App\Core\Hooks;

/**
 * The reminders the owning domains give an agent after its context was compacted, in the order they were added.
 */
final class CompactionReminders
{
    /**
     * @var list<string>
     */
    private array $reminders = [];

    public function add(string $reminder): void
    {
        $this->reminders[] = $reminder;
    }

    /**
     * @return list<string>
     */
    public function all(): array
    {
        return $this->reminders;
    }
}
