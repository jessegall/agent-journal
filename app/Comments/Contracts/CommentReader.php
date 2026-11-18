<?php

declare(strict_types=1);

namespace App\Comments\Contracts;

use App\Assignments\Support\Page;
use App\Comments\Data\CommentList;
use App\Comments\Data\RecordCommentLocation;
use App\Comments\Data\TextCommentLocation;
use App\Comments\Readers\CommentRecords;
use App\Records\Support\RecordIdentity;
use App\Text\Support\TextSelection;
use Illuminate\Container\Attributes\Bind;

/**
 * Reads the comments of a record the caller may read: a page of them, or where one of them points.
 */
#[Bind(CommentRecords::class)]
interface CommentReader
{
    public function list(RecordIdentity $target, Page $page): CommentList;

    public function location(RecordIdentity $target, string $commentId, TextSelection $selection = new TextSelection): RecordCommentLocation|TextCommentLocation;
}
