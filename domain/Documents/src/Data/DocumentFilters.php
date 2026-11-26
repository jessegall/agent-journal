<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Reads\Values\PageSize;
use Domain\Documents\Enums\AttentionFilter;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which documents or reports a list shows: by attention and by words in their text, newest first, a page at a time
 * after a cursor so rows added while paging are neither repeated nor skipped.
 */
#[TypeScript]
final class DocumentFilters extends Data
{
    public function __construct(
        public readonly AttentionFilter $attention = AttentionFilter::Active,
        #[Min(1)]
        public readonly int $page = 1,
        #[Min(1), Max(100)]
        public readonly int $perPage = 50,
        #[Max(200)]
        public readonly string $query = '',
        public readonly bool $revisions = false,
        public readonly string $after = '',
    ) {}

    public function searches(): bool
    {
        return trim($this->query) !== '';
    }

    public function pageSize(): PageSize
    {
        return PageSize::from($this->perPage);
    }
}
