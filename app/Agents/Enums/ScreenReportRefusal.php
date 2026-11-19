<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Why the journal refused a host's screen frame: the host does not run the runtime, nobody watches it, the frame is
 * over the size bound, or the runtime already sent its frames for this second.
 */
enum ScreenReportRefusal: string
{
    case NotYourRuntime = 'not_your_runtime';
    case NotWatched = 'not_watched';
    case TooLarge = 'too_large';
    case TooFast = 'too_fast';
}
