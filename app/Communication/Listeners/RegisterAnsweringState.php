<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Communication\States\Support\AnsweringMessageStateFactory;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Contracts\Listener;
use App\Hooks\Events\StateTypesRequested;

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
