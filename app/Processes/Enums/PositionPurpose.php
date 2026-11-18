<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why a reader keeps a position in a part: reading it live as output arrives, or replaying its retained bytes.
 */
enum PositionPurpose: string
{
    case Live = 'live';
    case Replay = 'replay';
}
