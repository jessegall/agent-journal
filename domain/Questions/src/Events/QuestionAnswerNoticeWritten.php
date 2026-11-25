<?php

declare(strict_types=1);

namespace Domain\Questions\Events;

use App\Support\ActorIdentity;
use Domain\Questions\Contracts\QuestionAnswerNoticeEvent;

/**
 * The asker of an answered question has a notice of the answer waiting.
 */
final readonly class QuestionAnswerNoticeWritten extends QuestionEvent implements QuestionAnswerNoticeEvent
{
    public function __construct(
        public string $noticeId,
        public string $questionId,
        public ActorIdentity $recipient,
    ) {}
}
