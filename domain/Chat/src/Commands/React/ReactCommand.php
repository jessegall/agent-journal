<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\React;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Reacts to a message with one emoji: an ordinary reply to it whose whole body is that emoji.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class ReactCommand extends Command
{
    public function __construct(public string $messageId, public string $emoji) {}
}
