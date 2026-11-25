<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadMessage;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use App\Support\ShownMessage;

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
