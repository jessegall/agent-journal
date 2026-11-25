<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

/**
 * A notice of a question's answer reached its agent's session.
 */
final readonly class QuestionAnswerNoticeDelivered extends QuestionEvent
{
    public function __construct(public string $noticeId, public string $questionId) {}
}
