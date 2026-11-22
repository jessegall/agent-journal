<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Why the journal refused a host's screen frame: the host does not run the runtime, nobody watches it, the frame is
 * over the size bound, the runtime already sent its frames for this second, or the frame is of a screen identity the
 * runtime's current one replaced: a retired stream, an older privacy revision or an earlier sequence.
 */
enum ScreenReportRefusal: string
{
    case NotYourRuntime = 'not_your_runtime';
    case NotWatched = 'not_watched';
    case TooLarge = 'too_large';
    case TooFast = 'too_fast';
    case Retired = 'retired';
}
