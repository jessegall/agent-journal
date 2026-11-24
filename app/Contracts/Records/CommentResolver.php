<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Data\Comments\CommentList;
use App\Data\Comments\RecordCommentLocation;
use App\Data\Comments\TextCommentLocation;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Support\TextSelection;

/**
 * Reads the comments of a record the caller may read: a page of them, or where one of them points.
 */
interface CommentResolver
{
    public function list(RecordIdentity $target, IdListPage $page): CommentList;

    public function location(
        RecordIdentity $target,
        string $commentId,
        TextSelection $selection = new TextSelection(),
    ): RecordCommentLocation|TextCommentLocation;
}
