<?php

declare(strict_types=1);

namespace Domain\Sequences\Support;

use App\Accounts\DraftAnswers;
use App\Data\Pages\DraftedRecordData;
use App\Messages\Data\DraftQuestionData;
use App\Navigation\Contracts\DraftProducer;
use Domain\Sequences\Http\Requests\SaveSequenceRequest;

/**
 * Drafts a sequence from three answers: what it is for becomes its name, the steps one line each, and when a step is
 * done the condition each step starts with. The draft opens in the new-sequence editor; nothing is saved before that.
 */
final readonly class SequenceDraftProducer implements DraftProducer
{
    public const string AGENT = 'Guided sequence draft';

    public function questions(): array
    {
        return [
            DraftQuestionData::from([
                'prompt' => 'What is the sequence for?',
                'suggestions' => ['Releasing a version', 'Reviewing a change', 'Setting up a project'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'What are the steps, in order? Separate them with commas.',
                'suggestions' => ['Plan, build, test', 'Read, change, review', 'Check, fix, check again'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'When is a step done?',
                'suggestions' => ['Its tests pass', 'Someone checked it', 'Its result is written down'],
            ]),
        ];
    }

    public function draft(array $answers): DraftedRecordData
    {
        $draft = DraftAnswers::of($answers);

        $steps = array_values(array_filter(
            array_map(trim(...), explode(',', $draft->to(2))),
            fn (string $step) => $step !== '',
        ));

        return DraftedRecordData::from([
            'fields' => [
                'name' => $draft->cutTo(1, SaveSequenceRequest::TEXT_CHARACTER_LIMIT),
                'steps' => implode("\n", $steps),
                'doneWhen' => $draft->to(3),
                'draftedBy' => self::AGENT,
            ],
            'agent' => self::AGENT,
        ]);
    }
}
