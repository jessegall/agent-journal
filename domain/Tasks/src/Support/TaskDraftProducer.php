<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\Navigation\DraftProducer;
use App\Data\Messages\DraftQuestionData;
use App\Data\Pages\DraftedRecordData;
use App\Support\DraftAnswers;
use Domain\Tasks\Models\Task;

/**
 * Drafts a task from three answers: what is done becomes its title, how it is known done and what it leaves alone its
 * brief. The draft is made by rule; nothing is saved until the form is sent.
 */
final readonly class TaskDraftProducer implements DraftProducer
{
    public const string AGENT = 'Guided task draft';

    public function questions(): array
    {
        return [
            DraftQuestionData::from([
                'prompt' => 'What should be done?',
                'suggestions' => ['Fix a bug', 'Add a page', 'Write a test', 'Update the docs'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'How will you know it is done?',
                'suggestions' => ['The tests pass', 'It shows on the page', 'The user can do it'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'Is there anything it must not touch?',
                'suggestions' => ['Nothing', 'The database', 'Other domains'],
            ]),
        ];
    }

    public function draft(array $answers): DraftedRecordData
    {
        $draft = DraftAnswers::of($answers, 3);

        return DraftedRecordData::from([
            'fields' => [
                'title' => $draft->cutTo(1, Task::TITLE_CHARACTER_LIMIT),
                'brief' => rtrim($draft->to(2), '.')."; it must not touch: {$draft->to(3)}",
            ],
            'agent' => self::AGENT,
        ]);
    }
}
