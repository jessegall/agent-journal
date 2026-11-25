<?php

declare(strict_types=1);

namespace Domain\Comments\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Reads where a comment points, and other lines of the revision it was left on.
 *
 * @implements ApiPayload<CommentLocated>
 */
#[Endpoint('comments/location', 'POST', CommentLocated::class, ApiEffect::Read)]
final class LocateCommentPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(64)]
        public string $target,
        #[Ulid]
        public string $comment,
        #[MapName('first_line'), Min(1), RequiredWith('last_line')]
        public int|null $firstLine = null,
        #[MapName('last_line'), Min(1), RequiredWith('first_line')]
        public int|null $lastLine = null,
    ) {}
}
