<?php

declare(strict_types=1);

namespace App\Supervision\Listeners;

use App\Contracts\Listener;
use App\Hooks\Events\StateTypesRequested;
use App\Supervision\States\AnsweringAskState;
use App\Supervision\States\Support\AnsweringAskStates;

final readonly class RegisterAnsweringAskState implements Listener
{
    public function __construct(private AnsweringAskStates $states) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(AnsweringAskState::TYPE, $this->states);
    }
}
