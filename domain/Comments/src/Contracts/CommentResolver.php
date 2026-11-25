<?php

declare(strict_types=1);

namespace Domain\Comments\Contracts;

use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Support\TextSelection;
use Domain\Comments\Data\CommentList;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\TextCommentLocation;

/**
 * Reads the comments of a record the caller may read: a page of them, or where one of them points.
 */
interface CommentResolver
{
    /**
     * One page of the record's comments.
     */
    public function list(RecordIdentity $target, IdListPage $page): CommentList;

    /**
     * The address a user's comment on a record is posted to.
     */
    public function commentAddress(): string;

    /**
     * Where the comment sits in the record: on the whole record, or on the text the selection marks.
     */
    public function location(
        RecordIdentity $target,
        string $commentId,
        TextSelection $selection = new TextSelection(),
    ): RecordCommentLocation|TextCommentLocation;
}
