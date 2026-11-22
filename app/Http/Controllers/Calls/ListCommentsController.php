<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Comments\ListCommentsCall;
use App\Contracts\Records\CommentResolver;
use App\Contracts\Records\RecordResolver;
use App\Data\CommentList;
use App\Support\Page;
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

        return $comments->list($target, new Page($call->after, PageSize::from($call->perPage)->rows));
    }
}
