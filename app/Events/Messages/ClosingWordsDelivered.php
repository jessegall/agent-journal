<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * An agent delivered its closing words as a message.
 */
final readonly class ClosingWordsDelivered extends MessageEvent
{
    public function __construct(public string $messageId, public string $agentId) {}
}
