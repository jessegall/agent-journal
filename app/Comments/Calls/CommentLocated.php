<?php

declare(strict_types=1);

namespace App\Comments\Calls;

use App\Comments\Enums\CommentType;
use App\Records\Data\RecordCard;
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
        public CommentType $type,
        public RecordCard $target,
        public array|null $anchor = null,
        public array|null $part = null,
    ) {}
}
