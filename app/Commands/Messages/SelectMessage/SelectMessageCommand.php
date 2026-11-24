<?php

declare(strict_types=1);

namespace App\Commands\Messages\SelectMessage;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * @extends Command<string>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class SelectMessageCommand extends Command
{
    public function __construct(public string $messageId) {}
}
