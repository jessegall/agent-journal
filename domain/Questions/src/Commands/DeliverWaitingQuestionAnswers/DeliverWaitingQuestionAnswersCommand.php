<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\DeliverWaitingQuestionAnswers;

use App\Support\Command;

/**
 * Delivers to a session that opened the notices of answers that came while its agent ran none, oldest first, a
 * bounded page at a time; returns how many it delivered.
 *
 * @extends Command<int>
 */
final readonly class DeliverWaitingQuestionAnswersCommand extends Command
{
    public const int BATCH = 50;

    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}
}
