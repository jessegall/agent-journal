<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Who closed a message without an answer: its recipient declined it, its sender withdrew it, or a user inspecting the
 * journal cancelled it.
 */
enum DismissalType: string
{
    case Declined = 'declined';
    case Withdrawn = 'withdrawn';
    case Cancelled = 'cancelled';
}
