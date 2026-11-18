<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

/**
 * Whether a record still asks for attention, or was settled as needing none.
 */
enum AttentionState: string
{
    case Active = 'active';
    case Settled = 'settled';
}
