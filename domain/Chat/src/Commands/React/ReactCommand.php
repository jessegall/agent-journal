<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\React;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Reacts to a message with one emoji: an ordinary reply to it whose whole body is that emoji.
 *
 * @extends Command<string>
 */
#[Authorize(MessagePolicy::class, AccessType::Create)]
#[RetainedActorRequestKey]
#[RepeatableRead]
final readonly class ReactCommand extends Command
{
    public function __construct(public string $messageId, public string $emoji) {}
}
