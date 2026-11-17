<?php

declare(strict_types=1);

namespace App\Domain\Chat\Listeners;

use App\Core\Hooks\Events\StateTypesRequested;
use App\Domain\Chat\AnsweringMessageFactory;
use App\Domain\Chat\AnsweringMessageReference;

final readonly class RegisterMessageState
{
    public function __construct(private AnsweringMessageFactory $factory) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(AnsweringMessageReference::TYPE_KEY, $this->factory);
    }
}
