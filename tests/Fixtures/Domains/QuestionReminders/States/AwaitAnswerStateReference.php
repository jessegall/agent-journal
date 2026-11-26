<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\States;

use App\Engine\Enums\NoSubject;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;

/**
 * The stack reference of awaiting an answer.
 */
final class AwaitAnswerStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'question_reminders.awaiting';
    }

    public static function withoutSubject(): StateReference
    {
        return self::about(NoSubject::None);
    }
}
