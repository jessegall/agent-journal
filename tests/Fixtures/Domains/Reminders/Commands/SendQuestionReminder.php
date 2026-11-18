<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reminders\Commands;

use App\Agents\Support\StackTarget;
use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Tests\Fixtures\Domains\Reminders\Handlers\SendQuestionReminderHandler;

/**
 * Reminds the asker of a question that is still waiting; the engine runs it from the asker's frame.
 *
 * @implements Command<null>
 */
#[HandledBy(SendQuestionReminderHandler::class)]
#[AllowsEngine]
final readonly class SendQuestionReminder implements Command
{
    public function __construct(
        public StackTarget $target,
        public string $questionId,
    ) {}
}
