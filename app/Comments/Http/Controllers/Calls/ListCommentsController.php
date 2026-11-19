<?php

declare(strict_types=1);

namespace App\Comments\Http\Controllers\Calls;

use App\Assignments\Support\Page;
use App\Comments\Calls\ListCommentsCall;
use App\Comments\Contracts\CommentResolver;
use App\Comments\Data\CommentList;
use App\Numbers\Support\RecordReference;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordResolver;

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
