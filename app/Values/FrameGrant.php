<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The engine delivering a tick to one frame: its commands may act on that frame's stack target only.
 */
final readonly class FrameGrant
{
    public function __construct(
        public StackTarget $target,
        public string $frameId,
    ) {}

    public function allowsTarget(StackTarget $target): bool
    {
        return $this->target->isSameAs($target);
    }

    public function description(): string
    {
        return "frame {$this->frameId} of {$this->target->description()}";
    }
}
