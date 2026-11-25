<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\React;

use App\Attributes\Commands\RetainedActorRequestKey;
use App\Support\Command;

/**
 * Reacts to a message with one emoji: an ordinary reply to it whose whole body is that emoji.
 *
 * @extends Command<string>
 */
#[RetainedActorRequestKey]
final readonly class ReactCommand extends Command
{
    public function __construct(public string $messageId, public string $emoji) {}
}
