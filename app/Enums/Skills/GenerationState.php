<?php

declare(strict_types=1);

namespace App\Enums\Skills;

/**
 * Where a skill generation stands: complete and usable, failed when a shipped skill was malformed, or retired.
 */
enum GenerationState: string
{
    case Ready = 'ready';
    case Failed = 'failed';
    case Retired = 'retired';
}
