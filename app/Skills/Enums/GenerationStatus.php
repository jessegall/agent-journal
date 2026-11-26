<?php

declare(strict_types=1);

namespace App\Skills\Enums;

/**
 * Where a skill generation stands: complete and usable, failed when a shipped skill was malformed, or retired.
 */
enum GenerationStatus: string
{
    case Ready = 'ready';
    case Failed = 'failed';
    case Retired = 'retired';
}
