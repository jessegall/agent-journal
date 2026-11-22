<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders;

use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder\SendQuestionReminderCommand;
use Tests\Fixtures\Domains\QuestionReminders\States\AwaitingAnswerLoader;

/**
 * A fixture domain with due work: an agent's question waits for an answer, and the engine sends one reminder once it
 * waited long enough. No production domain ticks yet; this shows the shape.
 */
final class QuestionRemindersDomain extends Domain implements CommandProvider, StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'A fixture domain whose waiting questions get one reminder from the engine.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function states(): array
    {
        return [AwaitingAnswerLoader::TYPE_KEY => AwaitingAnswerLoader::class];
    }

    public function commands(): array
    {
        return [SendQuestionReminderCommand::class];
    }
}
