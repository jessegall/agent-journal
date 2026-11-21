<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Values\StackTarget;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Inputs\Contracts\HookInput;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Runs the domains' reactions to a context start (a start, clear, resume or compaction) and collects their
 * reminders within the budget. It runs in the hook transaction after the replay check, so a replay runs none.
 */
final readonly class ContextCollection
{
    public function __construct(
        private Dispatcher $events,
        private ContextBudget $budget,
    ) {}

    /**
     * @return list<string>
     */
    public function collectReminders(StackTarget $target, HookInput $input): array
    {
        return $input->contextStart()
            ->map(fn (ContextStartType $type) => $this->remindersOn($target, $input, $type))
            ->getOrElse([]);
    }

    /**
     * @return list<string>
     */
    private function remindersOn(StackTarget $target, HookInput $input, ContextStartType $type): array
    {
        $reminders = new ContextReminders($this->budget);
        $this->events->dispatch(new ContextStarted($target, $input->identity()->hookId, $type, $reminders));

        return $reminders->all();
    }
}
