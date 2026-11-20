<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Contracts\Event;

/**
 * The dispatcher entry point for an event that registered states can observe.
 */
final readonly class StateEventBridge
{
    public const string LISTENER = self::class.'@receive';

    public function receive(Event $event): void {}
}
