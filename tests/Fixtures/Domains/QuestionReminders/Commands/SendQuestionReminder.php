<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Commands;

use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Tests\Fixtures\Bus\Enums\FixtureAbility;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Domains\QuestionReminders\Handlers\SendQuestionReminderHandler;

/**
 * Reminds the asker of a question that is still waiting; the engine runs it from the asker's frame.
 *
 * @implements Command<null>
 */
#[HandledBy(SendQuestionReminderHandler::class)]
#[Authorize(FixturePolicy::class, FixtureAbility::Work)]
final readonly class SendQuestionReminder implements Command, HasAuthorizationSubject
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
