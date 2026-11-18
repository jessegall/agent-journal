<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What of a run an actor read: its terminal envelope (every part's end, status and stream sizes) or a byte range of
 * one stream of one part.
 */
enum EvidenceSource: string
{
    case Envelope = 'envelope';
    case Stdout = 'stdout';
    case Stderr = 'stderr';
    case Merged = 'merged';

    public static function of(OutputStream $stream): self
    {
        return self::from($stream->value);
    }
}
