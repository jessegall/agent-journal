<?php

declare(strict_types=1);

namespace App\Connections\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One comment of a File window's thread: who wrote it, when, and its text.
 */
#[TypeScript]
final class FileCommentData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $author,
        public readonly string $createdAt,
        public readonly string $body,
    ) {}
}
