<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Data\CommentList;
use App\Data\RecordCommentLocation;
use App\Data\TextCommentLocation;
use App\Support\Page;
use App\Support\RecordIdentity;
use App\Support\TextSelection;

/**
 * Reads the comments of a record the caller may read: a page of them, or where one of them points.
 */
interface CommentResolver
{
    public function list(RecordIdentity $target, Page $page): CommentList;

    public function location(
        RecordIdentity $target,
        string $commentId,
        TextSelection $selection = new TextSelection(),
    ): RecordCommentLocation|TextCommentLocation;
}
