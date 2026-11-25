<?php

declare(strict_types=1);

namespace App\Enums\Assignments;

/**
 * What a command did to one record: changed its holder, left it as it was, or skipped it because its work is done.
 */
enum AssignmentOutcomeType: string
{
    case Changed = 'changed';
    case Unchanged = 'unchanged';
    case SkippedFinished = 'skipped_finished';
}
