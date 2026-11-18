<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Support\StackTarget;
use App\Hooks\Events\ContextWasCompacted;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Runs the domains' reactions to one compaction and collects their reminders. It runs in the hook transaction
 * before the stack lock, so a duplicate found under the lock rolls these effects back with everything else.
 */
final readonly class Compaction
{
    public function __construct(private Dispatcher $events) {}

    /**
     * @return list<string>
     */
    public function collectReminders(StackTarget $target, string $compactionId): array
    {
        $reminders = new CompactionReminders();
        $this->events->dispatch(new ContextWasCompacted($target, $compactionId, $reminders));

        return $reminders->all();
    }
}
