<?php

declare(strict_types=1);

namespace App\Messages\Commands\ReadMessage;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Messages\ShownMessage;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Reads one message of an inbox the actor is attached to and records the read.
 *
 * @extends Command<ShownMessage>
 */
#[Authorize(MessagePolicy::class, AccessType::Read)]
final readonly class ReadMessageCommand extends Command
{
    public function __construct(public string $messageId) {}
}
