<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * Why an agent's context starts again: a start, a clear, a resume or a compaction.
 */
enum ContextStartType: string
{
    case Start = 'start';
    case Clear = 'clear';
    case Resume = 'resume';
    case Compact = 'compact';

    /**
     * Whether the context starts empty again, after a clear or a compaction.
     */
    public function isFreshContext(): bool
    {
        return match ($this) {
            self::Clear, self::Compact => true,
            self::Start, self::Resume => false,
        };
    }
}
