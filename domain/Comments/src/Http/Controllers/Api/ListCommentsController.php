<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers\Api;

use App\Contracts\Records\RecordResolver;
use App\Support\IdListPage;
use App\Support\RecordReference;
use App\Values\PageSize;
use Domain\Comments\Api\ListCommentsPayload;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\CommentList;

/**
 * Lists one page of the comments on a record.
 */
final readonly class ListCommentsController
{
    public function __invoke(ListCommentsPayload $call, CommentResolver $comments, RecordResolver $records): CommentList
    {
        $target = $records->identify(RecordReference::parse($call->target));

        return $comments->list($target, new IdListPage($call->after, PageSize::from($call->perPage)->rows));
    }
}
