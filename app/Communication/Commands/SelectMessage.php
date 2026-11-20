<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\SelectMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * @extends Command<string>
 */
#[HandledBy(SelectMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
#[Operation('messages_select', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class SelectMessage extends Command implements AuthorizedCommand
{
    public function __construct(public string $messageId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
