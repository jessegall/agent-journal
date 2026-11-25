<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\DeliverWaitingQuestionAnswers;

use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Domain\Questions\Commands\Support\QuestionCommandHandler;
use Domain\Questions\Models\QuestionAnswerNotice;
use Domain\Questions\Support\QuestionAnswerNotices;

final readonly class DeliverWaitingQuestionAnswersHandler extends QuestionCommandHandler
{
    public function __construct(private QuestionAnswerNotices $notices) {}

    public function handle(DeliverWaitingQuestionAnswersCommand $command): int
    {
        $waiting = QuestionAnswerNotice::query()
            ->undeliveredFor(ActorIdentity::ofClass(Agent::class, $command->agentId))
            ->lockForUpdate()
            ->limit(DeliverWaitingQuestionAnswersCommand::BATCH)
            ->get();

        foreach ($waiting as $notice) {
            $this->notices->deliver($notice);
        }

        return $waiting->count();
    }
}
