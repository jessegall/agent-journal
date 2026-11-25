<?php

declare(strict_types=1);

namespace App\Enums\Runs;

/**
 * What a numbered report of a running runtime says: a request's progress or the runtime's activity.
 */
enum RuntimeEventType: string
{
    case RequestProgress = 'request_progress';
    case Activity = 'activity';
}
