<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers\Calls;

use Domain\Comments\Calls\ListCommentsCall;
use Domain\Comments\Contracts\CommentResolver;
use App\Contracts\Records\RecordResolver;
use Domain\Comments\Data\CommentList;
use App\Support\IdListPage;
use App\Support\RecordReference;
use App\Values\PageSize;

/**
 * Lists one page of the comments on a record.
 */
final readonly class ListCommentsController
{
    public function __invoke(ListCommentsCall $call, CommentResolver $comments, RecordResolver $records): CommentList
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $comments->list($target, new IdListPage($call->after, PageSize::from($call->perPage)->rows));
    }
}
