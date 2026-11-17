<?php

declare(strict_types=1);

namespace App\Domain\Sequences\Listeners;

use App\Core\Hooks\Events\StateTypesRequested;
use App\Domain\Sequences\FollowingSequenceFactory;
use App\Domain\Sequences\FollowingSequenceReference;

final readonly class RegisterSequenceState
{
    public function __construct(private FollowingSequenceFactory $factory) {}

    public function handle(StateTypesRequested $event): void
    {
        $event->registry->register(FollowingSequenceReference::TYPE_KEY, $this->factory);
    }
}
