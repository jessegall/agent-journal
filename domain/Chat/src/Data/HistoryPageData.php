<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Communication\Data\MessagePage;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One inbox's history on the History page, and whether the reader is inspecting it rather than sitting there.
 */
#[TypeScript]
final class HistoryPageData extends Data
{
    public function __construct(
        public readonly string|Optional $inboxId,
        public readonly bool $isInspection,
        public readonly MessagePage|Optional $page,
    ) {}
}
