<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Counting\Events;

use App\Contracts\Events\Event;

/**
 * One subject was seen, which the counting state of that subject counts.
 */
final readonly class SubjectSeen implements Event
{
    public function __construct(public string $subject) {}
}
