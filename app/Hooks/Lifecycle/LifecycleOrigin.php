<?php

declare(strict_types=1);

namespace App\Hooks\Lifecycle;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\LifecycleStage;

/**
 * Where a lifecycle command comes from: the stack, the settled change, the place of the answer in it, the frame and
 * the callback. Only the engine puts one in effect, while it runs that answer's commands.
 */
final readonly class LifecycleOrigin
{
    public function __construct(
        public StackTarget $target,
        public string $transitionId,
        public int $ordinal,
        public string $frameId,
        public StateReference $reference,
        public LifecycleStage $stage,
    ) {}

    public function description(): string
    {
        return "the {$this->stage->value} of frame {$this->frameId} on the stack of {$this->target->description()}";
    }
}
