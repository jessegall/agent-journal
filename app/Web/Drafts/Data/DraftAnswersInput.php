<?php

declare(strict_types=1);

namespace App\Web\Drafts\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The noun a guided draft is for and the answers given to its three questions.
 */
#[TypeScript]
final class DraftAnswersInput extends Data
{
    /**
     * The answers a draft takes: one for each of the three questions of a guided entry.
     */
    private const int ANSWER_COUNT = 3;

    /**
     * The most characters one answer holds.
     */
    private const int MOST_ANSWER_CHARACTERS = 2000;

    /**
     * @param  list<string>  $answers
     */
    public function __construct(public readonly string $noun, public readonly array $answers) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'noun' => [
                'required',
                'string',
                'max:64',
            ],
            'answers' => [
                'required',
                'array',
                'list',
                'size:'.self::ANSWER_COUNT,
            ],
            'answers.*' => [
                'required',
                'string',
                'max:'.self::MOST_ANSWER_CHARACTERS,
            ],
        ];
    }
}
