<?php

declare(strict_types=1);

namespace App\Data\Palette;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the keyboard palette searches for: the words and the scope they are searched within, how many hits it wants,
 * or the continuation of the page before.
 */
#[TypeScript]
final class SearchInput extends Data
{
    public function __construct(
        public readonly string $query,
        public readonly string|null $within = null,
        public readonly int|null $limit = null,
        public readonly string|null $continuation = null,
    ) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return ['limit' => [
            'nullable',
            'integer',
            'min:1',
        ]];
    }
}
