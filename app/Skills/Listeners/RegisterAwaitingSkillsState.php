<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Contracts\Listener;
use App\Hooks\Events\StateTypesRequested;
use App\Skills\States\Support\AwaitingSkillsStateFactory;
use App\Skills\States\Support\AwaitingSkillsStateReference;

/**
 * Hands the state a session is in while its new skill set is not delivered to the state registry when it is built.
 */
final readonly class RegisterAwaitingSkillsState implements Listener
{
    public function __construct(private AwaitingSkillsStateFactory $factory) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(AwaitingSkillsStateReference::TYPE_KEY, $this->factory);
    }
}
