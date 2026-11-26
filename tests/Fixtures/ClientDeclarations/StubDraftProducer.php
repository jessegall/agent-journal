<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Data\Pages\DraftedRecordData;
use App\Messages\Data\DraftQuestionData;
use App\Navigation\Contracts\DraftProducer;

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
