<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Engine\Enums\StackMoment;
use App\Stacks\Frames\Frame;

/**
 * Which frames a stack held and which of them were live before a change, so the change's lifecycle moments can be
 * read once it is made: the frames that went live, the frames that stopped being live and the frame that is the
 * live top again.
 */
final readonly class StackSnapshot
{
    /**
     * @param  list<string>  $frameIds
     * @param  array<string, Frame>  $liveFrames  by frame id
     */
    public function __construct(
        private array $frameIds,
        private array $liveFrames,
        private string $topId,
    ) {}

    /**
     * The frames of the changed stack and their moments, in the order they run: exits, then entries, then the resume.
     *
     * @return list<FrameMoment>
     */
    public function momentsOf(AgentStack $after): array
    {
        $liveAfter = [];

        foreach ($after->frames() as $frame) {
            if ($frame->isLive()) {
                $liveAfter[$frame->id] = $frame;
            }
        }

        $moments = [];

        foreach ($this->liveFrames as $id => $frame) {
            if (! isset($liveAfter[$id])) {
                $moments[] = new FrameMoment($frame, StackMoment::Exit);
            }
        }

        foreach ($liveAfter as $id => $frame) {
            if (! in_array($id, $this->frameIds, true)) {
                $moments[] = new FrameMoment($frame, StackMoment::Enter);
            }
        }

        $top = $after->top();

        if ($top->id !== $this->topId && in_array($top->id, $this->frameIds, true)) {
            $moments[] = new FrameMoment($top, StackMoment::Resume);
        }

        return $moments;
    }
}
