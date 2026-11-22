<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Where a message lives: desk mail between two inboxes, or a line in one chat inbox's timeline.
 */
enum MessageType: string
{
    case Desk = 'desk';
    case Chat = 'chat';
}
