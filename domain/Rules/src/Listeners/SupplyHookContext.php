<?php

declare(strict_types=1);

namespace Domain\Rules\Listeners;

use App\Contracts\Events\Listener;
use App\Events\ContextStarted;
use Domain\Rules\Support\ActiveRules;

/**
 * Reminds an agent of every rule that is active now whenever its context starts again; rules are always given.
 */
final readonly class SupplyHookContext implements Listener
{
    public function __construct(private ActiveRules $rules) {}

    public function handle(ContextStarted $event): void
    {
        foreach ($this->rules->reminders() as $reminder) {
            $event->reminders->add($reminder, true);
        }
    }
}
