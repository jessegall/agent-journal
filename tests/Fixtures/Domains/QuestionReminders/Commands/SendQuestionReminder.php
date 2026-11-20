<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Domains\QuestionReminders\Handlers\SendQuestionReminderHandler;

/**
 * Reminds the asker of a question that is still waiting; the engine runs it from the asker's frame.
 *
 * @extends Command<null>
 */
#[HandledBy(SendQuestionReminderHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
#[Operation('send_question_reminder', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class SendQuestionReminder extends Command implements AuthorizedCommand
{
    public function __construct(
        public StackTarget $target,
        public string $questionId,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return FixtureWork::class;
    }
}
