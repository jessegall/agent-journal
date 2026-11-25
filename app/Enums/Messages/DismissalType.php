<?php

declare(strict_types=1);

namespace App\Enums\Messages;

/**
 * Why a message was closed without an answer.
 */
enum DismissalType: string
{
    case Declined = 'declined';
    case Withdrawn = 'withdrawn';
    case Cancelled = 'cancelled';
}
