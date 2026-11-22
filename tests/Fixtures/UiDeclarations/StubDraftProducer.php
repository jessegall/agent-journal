<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations;

use App\Contracts\DraftProducer;
use App\Data\DraftedRecordData;
use App\Data\DraftQuestionData;

/**
 * A draft producer with three questions that drafts a title from the first answer.
 */
final class StubDraftProducer implements DraftProducer
{
    public const string AGENT = 'Agent 1';

    public function questions(): array
    {
        return array_map(
            fn (int $number) => new DraftQuestionData("Question {$number}", ['Yes', 'No']),
            [1, 2, 3],
        );
    }

    public function draft(array $answers): DraftedRecordData
    {
        return new DraftedRecordData(['title' => $answers[0]], self::AGENT);
    }
}
