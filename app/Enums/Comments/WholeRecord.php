<?php

declare(strict_types=1);

namespace App\Enums\Comments;

/**
 * What a comment is about when it points at no place in the text: the whole record.
 */
enum WholeRecord
{
    case Record;
}
