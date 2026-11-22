<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\StateTypesRequested;
use App\Support\States\AnsweringAskState;
use App\Support\States\Support\AnsweringAskStates;

final readonly class RegisterAnsweringAskState implements Listener
{
    public function __construct(private AnsweringAskStates $states) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(AnsweringAskState::TYPE, $this->states);
    }
}
