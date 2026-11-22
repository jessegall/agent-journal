<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Work;

use App\Contracts\IncomingWork;

/**
 * The reviews fixture's incoming work: it counts how often hooks accepted it, so a test sees it ran before the stack.
 */
final class ReviewInbox implements IncomingWork
{
    public static int $accepted = 0;

    public function accept(): void
    {
        self::$accepted++;
    }
}
