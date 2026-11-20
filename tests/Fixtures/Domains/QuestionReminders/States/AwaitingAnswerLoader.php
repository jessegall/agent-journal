<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\States;

use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Contracts\TickableStateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
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
)->readLimit(StateReferences::MAXIMUM)->get()->keyBy('id');

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

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return new AwaitingAnswerGuard();
    }
}
