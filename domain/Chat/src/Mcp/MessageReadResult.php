<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Data\AgentMessageCard;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Reads\Enums\ReadView;

/**
 * Renders message content and keeps continuation calls in their own field.
 */
final readonly class MessageReadResult
{
    public const string TOOL = 'messages_read';

    public function __construct(private AgentMessageReader $messages) {}

    public function read(string $messageId, ToolArguments $arguments, string $tool): ToolResult
    {
        $cursor = $arguments->continuation();

        $details = $cursor === null
            ? $this->messages->message($messageId, $arguments->enumOr('view', $this->defaultView($tool)))
            : $this->messages->context($messageId, $cursor);

        $messageResponse = ['message' => self::card($details->message)];
        $body = $details->body;

        if ($body !== null) {
            $messageResponse += [
                'body' => $body->text,
                'line_start' => $body->lineStart,
                'character_offset' => $body->characterStart,
            ];
        }

        return ToolResult::ok($messageResponse, $details->continuation === null ? [] : [new NextAction($tool, [
            'message_id' => $messageId,
            'continuation' => $details->continuation,
        ])]);
    }

    private function defaultView(string $tool): ReadView
    {
        return $tool === self::TOOL ? ReadView::Summary : ReadView::Context;
    }

    /**
     * @return array<string, mixed>
     */
    public static function card(AgentMessageCard $message): array
    {
        return [
            'message_id' => $message->id,
            'number' => $message->number,
            'preview' => $message->preview,
            'author' => $message->author->toArray(),
            'source_inbox_id' => $message->sourceInboxId,
            'recipient_inbox_id' => $message->recipientInboxId,
            'state' => $message->state->value,
            'revision' => $message->revision,
            'is_question' => $message->isQuestion,
            'unread' => $message->isUnread,
            'selected' => $message->isSelected,
            'job_source' => $message->isJobSource,
            'reply_to_id' => $message->replyToId,
            'answer_id' => $message->answerId,
            'dismissal_reason' => $message->dismissalReason,
        ];
    }
}
