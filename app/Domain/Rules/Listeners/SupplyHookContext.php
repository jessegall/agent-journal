<?php

declare(strict_types=1);

namespace App\Domain\Rules\Listeners;

use App\Domain\Hooks\Events\ContextWasCompacted;
use App\Domain\Rules\ActiveRules;

/**
 * Reminds a compacted agent of every rule that is active now.
 */
final readonly class SupplyHookContext
{
    public function __construct(private ActiveRules $rules) {}

    public function handle(ContextWasCompacted $event): void
    {
        foreach ($this->rules->reminders() as $reminder) {
            $event->reminders->add($reminder);
        }
    }
}
