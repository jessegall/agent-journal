<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionFilter;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The library page: a page of documents and of reports, and the notice that both are shared.
 */
#[TypeScript]
final class LibraryData extends Data
{
    public function __construct(
        public readonly PublicationList $documents,
        public readonly PublicationList $reports,
        public readonly string $sharingNotice,
        public readonly string $query,
        public readonly AttentionFilter $attention,
    ) {}
}
