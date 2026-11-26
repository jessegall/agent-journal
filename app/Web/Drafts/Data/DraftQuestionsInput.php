<?php

declare(strict_types=1);

namespace App\Web\Drafts\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The noun whose guided draft questions are asked for.
 */
#[TypeScript]
final class DraftQuestionsInput extends Data
{
    public function __construct(public readonly string $noun) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return ['noun' => [
            'required',
            'string',
            'max:64',
        ]];
    }
}
