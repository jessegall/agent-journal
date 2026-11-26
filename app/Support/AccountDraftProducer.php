<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Navigation\DraftProducer;
use App\Data\Messages\DraftQuestionData;
use App\Data\Pages\DraftedRecordData;
use App\Enums\Accounts\SignInMethod;
use App\Values\AccountLabel;

/**
 * Drafts a new account from three answers: the driver it is for, how it signs in and what it is called. The draft
 * opens the Add account wizard with those chosen; nothing is saved and no sign-in starts before the user goes on.
 */
final readonly class AccountDraftProducer implements DraftProducer
{
    public const string AGENT = 'Guided account draft';

    public function questions(): array
    {
        return [
            DraftQuestionData::from([
                'prompt' => 'Which driver is the account for?',
                'suggestions' => ['Claude Code', 'Codex'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'How does it sign in?',
                'suggestions' => ['A subscription, in the browser', 'An API key'],
            ]),
            DraftQuestionData::from([
                'prompt' => 'What should it be called?',
                'suggestions' => ['Work', 'Personal', 'Team key'],
            ]),
        ];
    }

    public function draft(array $answers): DraftedRecordData
    {
        $draft = DraftAnswers::of($answers, 3);

        return DraftedRecordData::from([
            'fields' => [
                'driver' => str_contains(strtolower($draft->to(1)), 'codex') ? 'codex' : 'claude-code',
                'method' => str_contains(strtolower($draft->to(2)), 'key')
                    ? SignInMethod::ApiKey->value
                    : SignInMethod::OAuth->value,
                'name' => $draft->cutTo(3, AccountLabel::LENGTH_LIMIT),
            ],
            'agent' => self::AGENT,
        ]);
    }
}
