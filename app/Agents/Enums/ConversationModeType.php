<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Whether a launch starts a new program conversation or resumes an earlier one.
 */
enum ConversationModeType: string
{
    case New = 'new';
    case Resume = 'resume';
}
