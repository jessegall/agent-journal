<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Agents\Support\StackTarget;
use App\Engine\Contracts\EngineGrant;

/**
 * The engine delivering a tick to one frame: its commands may act on that frame's stack target only.
 */
final readonly class FrameGrant implements EngineGrant
{
    public function __construct(
        public StackTarget $target,
        public string $frameId,
    ) {}

    public function allowsTarget(StackTarget $target): bool
    {
        return $this->target->isSameAs($target);
    }

    public function allowsMaintenance(string $capability): bool
    {
        return false;
    }

    public function description(): string
    {
        return "frame {$this->frameId} of {$this->target->description()}";
    }
}
