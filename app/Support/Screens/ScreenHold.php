<?php

declare(strict_types=1);

namespace App\Support\Screens;

use App\Enums\Drivers\HoldReason;

/**
 * What a still screen means for its runtime: the reason it holds, the menu family that shows, and the recorded keys
 * that pass a harmless menu instead of holding.
 */
final readonly class ScreenHold
{
    public function __construct(
        public HoldReason $reason,
        public string|null $menu = null,
        public string|null $answer = null,
    ) {}

    /**
     * A frame the host could not read or that was too large to send: nothing on it is guessed.
     */
    public static function unreadable(): self
    {
        return new self(HoldReason::ScreenUnreadable);
    }
}
