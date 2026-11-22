<?php

declare(strict_types=1);

namespace App\Enums;

use App\Exceptions\OfflineReplyModeInvalid;

/**
 * How a start's relay answers while the journal is unreachable: a neutral reply it logs as a bypass, or a refusal.
 * The journal decides it in the start grant; the relay only reads it.
 */
enum OfflineReplyMode: string
{
    case Neutral = 'neutral';
    case Refuse = 'refuse';

    /**
     * @throws OfflineReplyModeInvalid when the start names no mode the journal grants
     */
    public static function fromStart(string $modeText): self
    {
        return self::tryFrom($modeText) ?? throw OfflineReplyModeInvalid::for($modeText);
    }

    public function passesOutages(): bool
    {
        return $this === self::Neutral;
    }
}
