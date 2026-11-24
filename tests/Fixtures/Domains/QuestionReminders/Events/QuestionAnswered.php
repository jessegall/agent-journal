<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Events;

use App\Contracts\Events\Event;

/**
 * A question was answered.
 */
final readonly class QuestionAnswered implements Event
{
    public function __construct(public string $questionId) {}
}
