<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Data\Pages\TextSections;
use App\Support\TextPart;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\TextCommentLocation;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a record page read on request beside the record, each only when the page asked for it by reloading with its
 * query: where one comment points, the sections of a version of the text, and a part of its lines.
 */
#[TypeScript]
final class RecordReadsData extends Data
{
    public function __construct(
        public readonly RecordCommentLocation|TextCommentLocation|Optional $commentLocation = new Optional(),
        public readonly TextSections|Optional $textSections = new Optional(),
        public readonly TextPart|Optional $textPart = new Optional(),
    ) {}
}
