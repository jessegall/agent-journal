<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\StackTarget;
use App\Contracts\Event;
use Illuminate\Support\Str;
use PhpOption\Option;

/**
 * One dispatch of an application event and the scope it captured.
 */
final readonly class StateEventDispatch
{
    public string $id;

    /**
     * @param  Option<StateEventAudience>  $audience
     */
    public function __construct(
        public Event $event,
        public Option $audience,
        public bool $afterCommit = false,
    ) {
        $this->id = (string) Str::ulid();
    }

    public function scheduledAfterCommit(): self
    {
        return clone ($this, ['afterCommit' => true]);
    }

    public function checkTarget(StackTarget $target): void
    {
        $allowed = $this->audience->filter(fn (StateEventAudience $audience) => $audience->allowsTarget($target));

        if ($allowed->isEmpty()) {
            throw StackTargetRefused::forTarget($target->description());
        }
    }
}
