<?php

declare(strict_types=1);

namespace App\Engine\Enums;

use App\Stacks\Frames\Frame;

/**
 * Whether a stored frame is asked by a hook: live, finished, or switched off. A frame that is not live stays stored
 * until an explicit pop; a walk passes over it.
 */
enum FrameLiveness: string
{
    case Live = 'live';
    case Finished = 'finished';
    case Disabled = 'disabled';

    public static function of(Frame $frame): self
    {
        return match (true) {
            $frame->isFinished() => self::Finished,
            ! $frame->isEnabled() => self::Disabled,
            default => self::Live,
        };
    }
}
