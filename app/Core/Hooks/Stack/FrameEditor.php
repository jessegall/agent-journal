<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Contracts\StackEditor;
use App\Core\Hooks\Decisions\StateReference;

/**
 * The stack as the frame answering right now may change it, within one walk.
 */
final readonly class FrameEditor implements StackEditor
{
    public function __construct(
        private HookWalk $walk,
        private Frame $frame,
    ) {}

    public function popAnsweringState(): void
    {
        $this->walk->removeFrame($this->frame);
    }

    public function pushOverAnsweringState(StateReference $state): void
    {
        $this->walk->pushOver($this->frame, $state);
    }
}
