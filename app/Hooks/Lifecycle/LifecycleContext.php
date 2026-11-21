<?php

declare(strict_types=1);

namespace App\Hooks\Lifecycle;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\StateReference;

/**
 * What a lifecycle method is told: the stack the frame is on, the frame's id and the state it was built from.
 */
final readonly class LifecycleContext
{
    public function __construct(
        public StackTarget $target,
        public string $frameId,
        public StateReference $reference,
    ) {}
}
