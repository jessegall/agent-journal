<?php

declare(strict_types=1);

namespace Domain\Comments\Contracts;

use Domain\Comments\Enums\CommentType;

/**
 * A comment as a reader sees it, of either type: on a whole record or on a range of its text.
 */
interface CommentView
{
    /**
     * Which of the two a view is, a comment on the record or on its text.
     */
    public CommentType $type { get; }
}
