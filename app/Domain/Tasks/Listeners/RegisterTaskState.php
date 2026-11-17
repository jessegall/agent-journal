<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Listeners;

use App\Domain\Hooks\Events\StateTypesRequested;
use App\Domain\Tasks\WorkingOnTaskFactory;
use App\Domain\Tasks\WorkingOnTaskReference;

final readonly class RegisterTaskState
{
    public function __construct(private WorkingOnTaskFactory $factory) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(WorkingOnTaskReference::TYPE_KEY, $this->factory);
    }
}
