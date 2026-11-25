<?php

declare(strict_types=1);

namespace Domain\Comments\Enums;

/**
 * What a comment is about: the whole record, or a place in its text.
 */
enum CommentType: string
{
    case Record = 'record';
    case Text = 'text';
}
