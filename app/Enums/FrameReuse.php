<?php

declare(strict_types=1);

namespace App\Enums;

use App\Support\References\StateReference;

/**
 * How a push of a state finds a frame already on the stack instead of adding one: never, by the state type alone,
 * or by the state type and its subject.
 */
enum FrameReuse
{
    case None;
    case PerType;
    case PerSubject;

    /**
     * Whether the frame kept under the first reference takes a push of the second instead of a new frame.
     */
    public function keepsOneFrame(StateReference $kept, StateReference $pushed): bool
    {
        return match ($this) {
            self::None => false,
            self::PerType => $kept->typeKey === $pushed->typeKey,
            self::PerSubject => $kept->isSameAs($pushed),
        };
    }
}
