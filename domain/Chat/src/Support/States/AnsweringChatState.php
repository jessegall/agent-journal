<?php

declare(strict_types=1);

namespace Domain\Chat\Support\States;

use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Work\OwnValuesState;
use App\Events\ChatMessageAccepted;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\States\AgentState;
use App\Values\AnswerBudget;
use App\Values\RecoveryCall;
use App\Values\StackVerdict;
use Domain\Chat\Data\AnsweringValuesData;
use Domain\Chat\Events\MessageAwaitsAnswer;
use Domain\Chat\Events\MessageReactionAdded;
use Domain\Chat\Mcp\Tools\ReactToMessageTool;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent that was sent chat messages it has not answered yet. The state keeps its own list and its own count: each
 * message sent to the agent in this chat is added when the state hears of it, each tool use is one off the budget,
 * and after the budget everything but the journal's own tools is refused until the agent answers. A reply or a
 * reaction of the agent in this chat answers the whole list; a turn that ends on closing words answers with them.
 */
final class AnsweringChatState extends AgentState implements OwnValuesState
{
    private AnsweringValuesData $values;

    // ----------[ Lifecycle ]----------

    public function __construct(
        private readonly string $inboxId,
        private readonly AnswerBudget $budget,
    ) {
        $this->values = new AnsweringValuesData();
    }

    public function isFinished(): bool
    {
        return $this->values->isAnswered;
    }

    public function workPermission(): StackVerdict
    {
        if (! $this->mustAnswerNow()) {
            return StackVerdict::allow();
        }

        return StackVerdict::refuse(
            $this->answerNowText(),
            new RecoveryCall('messages_read', ['message_id' => $this->oldestId()]),
        );
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        if (! $this->hasWaiting()) {
            return parent::instruction();
        }

        return new Some($this->mustAnswerNow() ? $this->answerNowText() : $this->waitingText());
    }

    public function ownValues(): AnsweringValuesData
    {
        return $this->values;
    }

    public function restoreOwnValues(array $stored): void
    {
        $this->values = AnsweringValuesData::from($stored);
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return $this->decide();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->decide();
    }

    public function onToolRequested(ToolRequested $input): Decision
    {
        return $this->decide();
    }

    /**
     * A turn that ends on words answers the oldest waiting message with them, so an answer written only in the
     * terminal reaches the chat. A turn that ends on nothing is sent back once to answer.
     */
    public function onStop(StopRequested $input): Decision|ReplyToMessageCommand
    {
        if (! $this->hasWaiting() || $input->stop->isContinuation) {
            return Decision::delegate();
        }

        if (! $input->stop->hasClosingWords()) {
            return Decision::deny($this->answerNowText());
        }

        $reply = new ReplyToMessageCommand($this->oldestId(), null, $input->stop->closingWords);
        $this->values = $this->values->answered();

        return $reply;
    }

    /**
     * One tool use off the budget. The journal's own tools never reach a state, so answering costs nothing.
     */
    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->values = $this->values->withToolUse();

        return Decision::delegate();
    }

    // ----------[ Events ]----------

    /**
     * A message was sent to the agent in this chat: it joins the list.
     */
    public function onMessageAwaitsAnswer(MessageAwaitsAnswer $event): void
    {
        if ($event->inboxId === $this->inboxId) {
            $this->values = $this->values->withMessage($event->messageId);
        }
    }

    /**
     * The agent's own message in this chat is its answer to everything that waited there.
     */
    public function onChatMessageAccepted(ChatMessageAccepted $event): void
    {
        $this->hearAnswer($event->inboxId, $event->author);
    }

    /**
     * A reaction of the agent in this chat is an answer too, for a message that needs no words.
     */
    public function onMessageReactionAdded(MessageReactionAdded $event): void
    {
        $this->hearAnswer($event->inboxId, $event->owner);
    }

    // ----------[ Internals ]----------

    /**
     * Something an agent posted in a chat: in this state's chat it is the agent's answer, since only the agent's own
     * calls reach its stack.
     */
    private function hearAnswer(string $inboxId, ActorIdentity $by): void
    {
        if ($inboxId === $this->inboxId && $by->isAgent()) {
            $this->values = $this->values->answered();
        }
    }

    private function hasWaiting(): bool
    {
        return $this->values->waitingIds !== [];
    }

    private function oldestId(): string
    {
        return $this->values->waitingIds[0] ?? '';
    }

    private function decide(): Decision
    {
        return $this->mustAnswerNow() ? Decision::deny($this->answerNowText()) : Decision::delegate();
    }

    private function mustAnswerNow(): bool
    {
        return $this->hasWaiting() && $this->budget->leftAfter($this->values->toolUses) === 0;
    }

    private function waitingText(): string
    {
        $left = $this->budget->leftAfter($this->values->toolUses);

        return "{$this->countText()} in the chat. You have {$left} tool uses left before you must answer. "
            .$this->howToAnswerText();
    }

    private function answerNowText(): string
    {
        return "{$this->countText()} in the chat and your tool uses are used up. Answer now, then go on. "
            .$this->howToAnswerText();
    }

    private function howToAnswerText(): string
    {
        $react = ReactToMessageTool::NAME;

        return "Reply with messages_reply, message_id {$this->oldestId()}; or, when no words are needed, react with "
            ."{$react}, chat_id {$this->inboxId}, message_id {$this->oldestId()} and an emoji.";
    }

    private function countText(): string
    {
        $waiting = count($this->values->waitingIds);

        return $waiting === 1 ? '1 message waits for your answer' : "{$waiting} messages wait for your answer";
    }
}
