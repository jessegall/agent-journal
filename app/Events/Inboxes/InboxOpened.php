<?php

declare(strict_types=1);

namespace App\Events\Inboxes;

/**
 * An inbox was opened.
 */
final readonly class InboxOpened extends InboxEvent
{
    public function __construct(public string $inboxId) {}
}
