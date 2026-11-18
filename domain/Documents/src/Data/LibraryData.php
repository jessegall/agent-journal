<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The library page: a page of documents and of reports, and the notice that both are shared.
 */
#[TypeScript]
final class LibraryData extends Data
{
    public function __construct(
        public readonly DocumentList $documents,
        public readonly ReportList $reports,
        public readonly string $sharingNotice,
        public readonly string $query,
    ) {}
}
