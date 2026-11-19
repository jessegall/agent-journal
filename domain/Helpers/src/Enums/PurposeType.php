<?php

declare(strict_types=1);

namespace Domain\Helpers\Enums;

/**
 * What a helper's purpose is about: one record (a subject), or free work with no record.
 */
enum PurposeType: string
{
    case Subject = 'subject';
    case Free = 'free';
}
