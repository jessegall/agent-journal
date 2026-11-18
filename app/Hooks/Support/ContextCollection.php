<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\SessionStarted;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Runs the domains' reactions to a context start (a launch, clear, resume or compaction) and collects their
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
        $type = match (true) {
            $input instanceof SessionStarted => ContextStartType::fromSource($input->start->source),
            $input instanceof ContextCompacted => ContextStartType::Compact,
            default => null,
        };

        if ($type === null) {
            return [];
        }

        $reminders = new ContextReminders($this->budget);
        $this->events->dispatch(new ContextStarted($target, $input->identity()->hookId, $type, $reminders));

        return $reminders->all();
    }
}
