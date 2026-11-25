<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Enums\Engine\StackMoment;
use App\Support\Stack\Frames\Frame;

/**
 * One frame at one moment of its life on its stack, which its state answers with the commands to run.
 */
final readonly class FrameMoment
{
    public function __construct(public Frame $frame, public StackMoment $moment) {}

    /**
     * @return list<Command<mixed>|Event>
     */
    public function effects(): array
    {
        return $this->frame->answerMoment($this->moment);
    }
}
