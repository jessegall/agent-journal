<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reminders;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Domains\Reminders\Commands\SendQuestionReminder;
use Tests\Fixtures\Domains\Reminders\States\AwaitingAnswerLoader;

/**
 * A fixture domain with due work: an agent's question waits for an answer, and the engine sends one reminder once it
 * waited long enough. No production domain ticks yet; this shows the shape.
 */
final class RemindersDomain extends Domain implements ProvidesCommands, ProvidesStates
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
        return [SendQuestionReminder::class];
    }
}
