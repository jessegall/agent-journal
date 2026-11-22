<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\StateTypesRequested;
use App\Support\States\Support\AnsweringMessageStateFactory;
use App\Support\States\Support\AnsweringMessageStateReference;

/**
 * Hands the state an agent is in while it owes an answer to the state registry whenever it is built.
 */
final readonly class RegisterAnsweringState implements Listener
{
    public function __construct(private AnsweringMessageStateFactory $factory) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(AnsweringMessageStateReference::TYPE_KEY, $this->factory);
    }
}
