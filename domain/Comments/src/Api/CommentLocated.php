<?php

declare(strict_types=1);

namespace Domain\Comments\Api;

use App\Data\Pages\RecordCard;
use Domain\Comments\Enums\CommentType;
use Spatie\LaravelData\Data;

/**
 * Where a comment points: its record, and for a comment on text its anchor and the lines read.
 */
final class CommentLocated extends Data
{
    /**
     * @param  array<string, mixed>|null  $anchor
     * @param  array<string, mixed>|null  $part
     */
    public function __construct(
        public readonly CommentType $type,
        public readonly RecordCard $target,
        public readonly array|null $anchor = null,
        public readonly array|null $part = null,
    ) {}
}
