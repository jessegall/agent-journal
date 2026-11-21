<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Commands;

use App\Agents\Values\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Tests\Fixtures\Bus\Policies\FixturePolicy;

/**
 * Reminds the asker of a question that is still waiting; the engine runs it from the asker's frame.
 *
 * @extends Command<null>
 */
#[Authorize(FixturePolicy::class, AccessType::Create)]
final readonly class SendQuestionReminder extends Command
{
    public function __construct(
        public StackTarget $target,
        public string $questionId,
    ) {}
}
