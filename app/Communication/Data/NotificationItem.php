<?php

declare(strict_types=1);

namespace App\Communication\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One receipt as its recipient sees it: its place in the sequence, when it was read, its plain-text title and where
 * it leads. A target that is gone but may still be named has no destination and a generic title.
 */
#[TypeScript]
final class NotificationItem extends Data
{
    public const string UNAVAILABLE_TITLE = 'This item is unavailable';

    public function __construct(
        public readonly string $id,
        public readonly int $sequence,
        public readonly string|null $readAt,
        public readonly string $title,
        public readonly NotificationDestination|Optional $target,
    ) {}
}
