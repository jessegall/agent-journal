<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What one part of a delivery holds: text, or a reference to an attachment the agent reads itself.
 */
enum MessagePartType: string
{
    case Text = 'text';
    case Attachment = 'attachment';
}
