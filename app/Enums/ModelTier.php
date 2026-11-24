<?php

declare(strict_types=1);

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How demanding the work a profile does is, from which a start takes its default model: each driver family names one
 * model per tier.
 */
#[TypeScript]
enum ModelTier: int
{
    case Simplest = 1;
    case General = 2;
    case Inventive = 3;
    case Exceptional = 4;

    public function label(): string
    {
        return match ($this) {
            self::Simplest => 'Simplest work',
            self::General => 'General work',
            self::Inventive => 'Complex work',
            self::Exceptional => 'Exceptional work',
        };
    }

    /**
     * What the tier is for, in plain words for the profile screen.
     */
    public function description(): string
    {
        return match ($this) {
            self::Simplest => 'Reading, sorting and small chores.',
            self::General => 'Coding where the way is clear.',
            self::Inventive => 'Complex coding that needs invention.',
            self::Exceptional => 'Only when you ask for it.',
        };
    }
}
