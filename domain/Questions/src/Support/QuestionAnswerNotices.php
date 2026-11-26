<?php

declare(strict_types=1);

namespace Domain\Questions\Support;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Contracts\AgentNotices;
use App\Time\Contracts\ServerClock;
use App\Values\AgentText;
use Domain\Questions\Models\QuestionAnswerNotice;

/**
 * Hands a notice of an answer to its agent's running session as the journal hands any notice to an agent, and marks it
 * delivered once a session took it; a retry is sent under the same key.
 */
final readonly class QuestionAnswerNotices
{
    public function __construct(
        private AgentNotices $agents,
        private AgentTexts $texts,
        private ServerClock $clock,
    ) {}

    public function deliver(QuestionAnswerNotice $notice): void
    {
        $text = $this->texts->render(AgentText::of('core.questions.answered', ['question' => $notice->question_id]));

        if ($this->agents->notify($notice->recipient_id, $text, $notice->delivery_key)) {
            $notice->markDelivered($this->clock->now());
        }
    }
}
