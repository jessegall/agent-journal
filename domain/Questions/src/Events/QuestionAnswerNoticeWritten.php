<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

/**
 * The asker of an answered question has a notice of the answer waiting.
 */
final readonly class QuestionAnswerNoticeWritten extends QuestionEvent
{
    public function __construct(public string $noticeId, public string $questionId, public string $agentId) {}
}
