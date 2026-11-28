<?php

declare(strict_types=1);

namespace App\Messages\Commands\RetryDelivery;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * The sender of a message whose delivery failed queues it again: its failure and reason are cleared, and it waits for
 * its agent as a new message does.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class RetryDeliveryCommand extends Command
{
    public function __construct(public string $messageId) {}
}
