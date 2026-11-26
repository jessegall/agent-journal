<?php

declare(strict_types=1);

namespace App\Http\Requests\Web\Concerns;

use App\Reads\Values\PageSize;
use App\Support\IdListPage;

/**
 * Reads the page of a record's comments a reader asks for: the first one, or the one after the comment a reload
 * names.
 */
trait ReadsCommentsPage
{
    public function commentsPage(): IdListPage
    {
        $after = $this->filled('commentsAfter') ? $this->string('commentsAfter')->toString() : null;

        return new IdListPage($after, PageSize::from(null)->rows);
    }
}
