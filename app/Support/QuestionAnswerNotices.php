<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Time\ServerClock;
use App\Models\Questions\QuestionAnswerNotice;
use App\Values\AgentText;

/**
 * Hands a notice of an answer to a running session of its agent, in the transaction that has the session, and marks
 * it delivered with the driver request; a retry is sent under the same key.
 */
final readonly class QuestionAnswerNotices
{
    public function __construct(
        private CommandBus $commands,
        private AgentTexts $texts,
        private ServerClock $clock,
    ) {}

    public function deliver(QuestionAnswerNotice $notice, string $sessionId): void
    {
        $this->commands->run(DeliverAgentCommand::text(
            $notice->agent_id,
            $sessionId,
            $notice->delivery_key,
            $this->texts->render(AgentText::of('core.questions.answered', ['question' => $notice->question_id])),
        ));

        $notice->markDelivered($this->clock->now());
    }
}
