<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

use App\Bus\Contracts\ClassLevelAbilities;

/**
 * What an actor may do with a task's run.
 */
enum TaskAbility: string implements ClassLevelAbilities
{
    case Start = 'start';
    case Finish = 'finish';
    case Block = 'block';
    case Cancel = 'cancel';
    case Work = 'work';

    /**
     * Whether only the holder of the task's run may do it.
     */
    public function needsTheRunHolder(): bool
    {
        return match ($this) {
            self::Start, self::Work => false,
            self::Finish, self::Block, self::Cancel => true,
        };
    }

    /**
     * Ordinary work in the area is decided on the model class alone; the other abilities on a record.
     */
    public function isClassLevel(): bool
    {
        return $this === self::Work;
    }
}
