<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

use Domain\Questions\Contracts\QuestionAnswerNoticeEvent;

/**
 * A notice of a question's answer reached its agent's session.
 */
final readonly class QuestionAnswerNoticeDelivered extends QuestionEvent implements QuestionAnswerNoticeEvent
{
    public function __construct(public string $noticeId, public string $questionId) {}
}
