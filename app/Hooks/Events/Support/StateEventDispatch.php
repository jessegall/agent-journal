<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

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
     * @param Option<StateEventAudience> $audience
     */
    public function __construct(public Event $event, public Option $audience)
    {
        $this->id = (string) Str::ulid();
    }

    public function checkTarget(StackTarget $target): void
    {
        $allowed = $this->audience->filter(fn (StateEventAudience $audience) => $audience->allowsTarget($target));

        if ($allowed->isEmpty()) {
            throw StackTargetRefused::forTarget($target->description());
        }
    }
}
