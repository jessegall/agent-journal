<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * Why an agent's context starts again: a launch, a clear, a resume or a compaction.
 */
enum ContextStartType: string
{
    case Launch = 'launch';
    case Clear = 'clear';
    case Resume = 'resume';
    case Compact = 'compact';

    public static function fromSource(SessionStartSource $source): self
    {
        return match ($source) {
            SessionStartSource::Startup => self::Launch,
            SessionStartSource::Clear => self::Clear,
            SessionStartSource::Resume => self::Resume,
            SessionStartSource::Compact => self::Compact,
        };
    }

    /**
     * Whether the context starts empty again, after a clear or a compaction.
     */
    public function isFreshContext(): bool
    {
        return match ($this) {
            self::Clear, self::Compact => true,
            self::Launch, self::Resume => false,
        };
    }
}
