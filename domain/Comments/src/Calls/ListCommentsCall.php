<?php

declare(strict_types=1);

namespace Domain\Comments\Calls;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Support\IdListPage;
use Domain\Comments\Data\CommentList;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Lists the comments on a record, oldest first, one page after the comment named.
 *
 * @implements JournalCall<CommentList>
 */
#[Endpoint('comments/list', 'POST', CommentList::class, CallEffect::Read)]
final class ListCommentsCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(64)]
        public readonly string $target,
        #[Ulid]
        public readonly string|null $after = null,
        #[MapName('per_page'), Min(1), Max(IdListPage::LARGEST_LIMIT)]
        public readonly int|null $perPage = null,
    ) {}
}
