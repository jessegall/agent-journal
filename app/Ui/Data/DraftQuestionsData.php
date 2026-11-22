<?php

declare(strict_types=1);

namespace App\Ui\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The questions a noun's draft producer asks, in order.
 */
#[TypeScript]
final class DraftQuestionsData extends Data
{
    /**
     * @param  list<DraftQuestionData>  $questions
     */
    public function __construct(
        #[DataCollectionOf(DraftQuestionData::class)]
        public readonly array $questions,
    ) {}
}
