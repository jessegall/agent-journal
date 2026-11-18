<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * Where a message stands: sent, waiting for an agent's answer, answered or dismissed.
 */
enum MessageState: string
{
    case Sent = 'sent';
    case WaitingForAnswer = 'waiting_for_answer';
    case Answered = 'answered';
    case Dismissed = 'dismissed';
}
