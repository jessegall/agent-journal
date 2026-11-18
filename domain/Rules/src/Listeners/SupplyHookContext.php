<?php

declare(strict_types=1);

namespace Domain\Rules\Listeners;

use App\Contracts\Listener;
use App\Hooks\Events\ContextWasCompacted;
use Domain\Rules\Support\ActiveRules;

/**
 * Reminds a compacted agent of every rule that is active now.
 */
final readonly class SupplyHookContext implements Listener
{
    public function __construct(private ActiveRules $rules) {}

    public function handle(ContextWasCompacted $event): void
    {
        foreach ($this->rules->reminders() as $reminder) {
            $event->reminders->add($reminder);
        }
    }
}
