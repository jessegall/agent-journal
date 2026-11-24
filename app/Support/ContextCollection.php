<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Enums\ContextStartType;
use App\Events\Hooks\ContextStarted;
use App\Support\Inputs\Contracts\HookInput;
use App\Values\StackTarget;
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
        private AgentTexts $texts,
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
        $reminders = new ContextReminders($this->budget, $this->texts);
        $this->events->dispatch(new ContextStarted($target, $input->identity()->hookId, $type, $reminders));

        return $reminders->all();
    }
}
