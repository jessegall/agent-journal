<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Comments\Data\RecordCommentLocation;
use App\Comments\Data\TextCommentLocation;
use App\Text\Data\TextSections;
use App\Text\Support\TextPart;
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
