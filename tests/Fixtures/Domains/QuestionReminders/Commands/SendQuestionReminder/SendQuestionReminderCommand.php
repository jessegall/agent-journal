<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder;

use App\Values\StackTarget;
use App\Attributes\Authorize;
use App\Support\Command;
use App\Enums\AccessType;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * Reminds the asker of a question that is still waiting; the engine runs it from the asker's frame.
 *
 * @extends Command<null>
 */
#[Authorize(FixturePolicy::class, AccessType::Create)]
final readonly class SendQuestionReminderCommand extends Command
{
    public function __construct(
        public StackTarget $target,
        public string $questionId,
    ) {}
}
