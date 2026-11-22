<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\States;

use App\Support\StateLoading\Contracts\TickableStateLoader;
use App\Contracts\Work\WorkOccurrenceGuard;
use App\Support\References\StateReference;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Support\References\SubjectReference;
use App\Enums\SessionTransferType;
use App\Exceptions\StateSubjectMissing;
use Tests\Fixtures\Domains\QuestionReminders\Models\Question;

/**
 * Restores the waiting questions of a batch in one read.
 */
final class AwaitingAnswerLoader implements TickableStateLoader
{
    public const string TYPE_KEY = 'reminders.awaiting';

    public function stateClass(): string
    {
        return AwaitingAnswerState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $questions = Question::query()->whereKey(
            $references->subjectIds(),
        )->limit(StateReferences::MAXIMUM)->get()->keyBy('id');

        return StateSet::build($references, function (StateReference $reference) use ($questions): AwaitingAnswerState {
            $question = $reference->subject instanceof SubjectReference ? $questions->get(
                $reference->subject->id,
            ) : null;

            if (! $question instanceof Question) {
                throw StateSubjectMissing::for(self::TYPE_KEY);
            }

            return new AwaitingAnswerState($question->id, ! $question->isWaiting());
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return new AwaitingAnswerGuard();
    }
}
