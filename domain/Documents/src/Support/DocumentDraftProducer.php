<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Contracts\Navigation\DraftProducer;
use App\Data\Messages\DraftQuestionData;
use App\Data\Pages\DraftedRecordData;
use App\Support\DraftAnswers;
use Domain\Documents\Models\Document;

/**
 * Drafts a document from three answers: what it is about becomes its title and its one line, who reads it and what
 * must be in it its text. The draft is made by rule; nothing is saved until the form is sent.
 */
final readonly class DocumentDraftProducer implements DraftProducer
{
    public const string AGENT = 'Guided document draft';

    public function questions(): array
    {
        return [
            DraftQuestionData::from([
                'prompt' => 'What is the document about?',
                'suggestions' => [
                    'A design',
                    'A decision',
                    'How something works',
                    'A guide',
                ],
            ]),
            DraftQuestionData::from([
                'prompt' => 'Who reads it, and what do they decide with it?',
                'suggestions' => [
                    'The team, what to build',
                    'A reviewer, whether it is right',
                    'A newcomer, how to start',
                ],
            ]),
            DraftQuestionData::from([
                'prompt' => 'What must be in it?',
                'suggestions' => [
                    'The goal and the steps',
                    'The options and the choice',
                    'Examples',
                ],
            ]),
        ];
    }

    public function draft(array $answers): DraftedRecordData
    {
        $draft = DraftAnswers::of($answers, 3);

        return DraftedRecordData::from([
            'fields' => [
                'title' => $draft->cutTo(1, Document::TITLE_CHARACTER_LIMIT),
                'abstract' => $draft->to(1),
                'body' => "Who reads it: {$draft->to(2)}\n\nWhat it holds: {$draft->to(3)}",
            ],
            'agent' => self::AGENT,
        ]);
    }
}
