<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Whether a start opens a new driver conversation or resumes an earlier one.
 */
enum ConversationModeType: string
{
    case New = 'new';
    case Resume = 'resume';
}
