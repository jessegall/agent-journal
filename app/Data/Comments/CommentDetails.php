<?php

declare(strict_types=1);

namespace App\Data\Comments;

use App\Enums\Assignments\ActorType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One comment as it is shown: who left it and when, its text and its text as safe HTML.
 */
#[TypeScript]
final class CommentDetails extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly ActorType $authorType,
        public readonly string $authorId,
        public readonly string $createdAt,
        public readonly string $body,
        public readonly string $bodyHtml,
    ) {}
}
