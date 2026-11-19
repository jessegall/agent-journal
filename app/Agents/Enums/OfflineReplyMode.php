<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Agents\Exceptions\OfflineReplyModeInvalid;

/**
 * How a launch's relay answers while the journal is unreachable: a neutral reply it logs as a bypass, or a refusal.
 * The journal decides it in the launch grant; the relay only reads it.
 */
enum OfflineReplyMode: string
{
    case Neutral = 'neutral';
    case Refuse = 'refuse';

    /**
     * @throws OfflineReplyModeInvalid when the launch names no mode the journal grants
     */
    public static function fromLaunch(string $value): self
    {
        return self::tryFrom($value) ?? throw OfflineReplyModeInvalid::for($value);
    }

    public function passesOutages(): bool
    {
        return $this === self::Neutral;
    }
}
