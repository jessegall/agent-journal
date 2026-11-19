<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * What an actor may do with a task's run.
 */
enum TaskAbility: string
{
    case Start = 'start';
    case Finish = 'finish';
    case Block = 'block';
    case Cancel = 'cancel';

    /**
     * Whether only the holder of the task's run may do it.
     */
    public function needsTheRunHolder(): bool
    {
        return match ($this) {
            self::Start => false,
            self::Finish, self::Block, self::Cancel => true,
        };
    }
}
