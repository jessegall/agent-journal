<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Events\ContextWasCompacted;
use App\Domain\Hooks\Storage\StackTarget;
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
    public function react(StackTarget $target, string $compactionId): array
    {
        $reminders = new CompactionReminders;
        $this->events->dispatch(new ContextWasCompacted($target->agentId, $target->sessionId, $compactionId, $reminders));

        return $reminders->all();
    }
}
