<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\DeliverWaitingQuestionAnswers;

use App\Contracts\Bus\CommandHandler;
use Domain\Questions\Models\QuestionAnswerNotice;
use Domain\Questions\Support\QuestionAnswerNotices;

final readonly class DeliverWaitingQuestionAnswersHandler implements CommandHandler
{
    public function __construct(private QuestionAnswerNotices $notices) {}

    public function handle(DeliverWaitingQuestionAnswersCommand $command): int
    {
        $waiting = QuestionAnswerNotice::query()
            ->undeliveredFor($command->agentId)
            ->lockForUpdate()
            ->limit(DeliverWaitingQuestionAnswersCommand::BATCH)
            ->get();

        foreach ($waiting as $notice) {
            $this->notices->deliver($notice, $command->sessionId);
        }

        return $waiting->count();
    }
}
