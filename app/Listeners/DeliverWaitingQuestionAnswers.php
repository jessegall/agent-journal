<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionOpened;
use App\Models\Questions\QuestionAnswerNotice;
use App\Support\QuestionAnswerNotices;

/**
 * A session that opens gets the notices of answers that came while its agent ran none, oldest first, a bounded page
 * at a time.
 */
#[InCommandTransaction]
final readonly class DeliverWaitingQuestionAnswers implements Listener
{
    private const int NOTICE_LIMIT = 50;

    public function __construct(private QuestionAnswerNotices $notices) {}

    public function handle(SessionOpened $event): void
    {
        $waiting = QuestionAnswerNotice::query()
            ->undeliveredFor($event->agentId)
            ->lockForUpdate()
            ->limit(self::NOTICE_LIMIT)
            ->get();

        foreach ($waiting as $notice) {
            $this->notices->deliver($notice, $event->sessionId);
        }
    }
}
