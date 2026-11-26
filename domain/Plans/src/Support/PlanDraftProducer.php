<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Accounts\DraftAnswers;
use App\Data\Pages\DraftedRecordData;
use App\Messages\Data\DraftQuestionData;
use App\Navigation\Contracts\DraftProducer;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;

/**
 * Drafts a plan from three answers: what it is for becomes its title, how it is known done and what must hold first
 * its goal, and its type the first the form lists. The draft is made by rule; nothing is saved until the form is sent.
 */
final readonly class PlanDraftProducer implements DraftProducer
{
    public const string AGENT = 'Guided plan draft';

    public function questions(): array
    {
        return [
            DraftQuestionData::from([
                'prompt' => 'What is the plan for?',
                'suggestions' => ['Build a feature', 'Fix a set of bugs', 'Research a question', 'Clean up code'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'How will you know it is done?',
                'suggestions' => ['The feature works on the server', 'The tests pass', 'The question is answered'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'What must be true before it starts?',
                'suggestions' => ['Nothing', 'A design is approved', 'Another plan is finished'],
            ]),
        ];
    }

    public function draft(array $answers): DraftedRecordData
    {
        $draft = DraftAnswers::of($answers, 3);

        return DraftedRecordData::from([
            'fields' => [
                'title' => $draft->cutTo(1, Plan::TITLE_CHARACTER_LIMIT),
                'brief' => rtrim($draft->to(2), '.')."; before it starts: {$draft->to(3)}",
                'type' => PlanType::cases()[0]->value,
            ],
            'agent' => self::AGENT,
        ]);
    }
}
