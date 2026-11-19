<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Communication\Events\MessageSent;
use RuntimeException;

/**
 * A listener whose own store is down, so it fails on every message sent.
 */
final class FailingMessageListener
{
    public function handle(MessageSent $sent): void
    {
        throw new RuntimeException("The store is down while hearing {$sent->messageId}.");
    }
}
