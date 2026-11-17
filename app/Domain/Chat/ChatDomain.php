<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Domain\Chat\Api\Conversation;
use App\Domain\Chat\Api\Events\MessageAnswered;
use App\Domain\Chat\Api\Events\MessageDismissed;
use App\Domain\Chat\Api\Events\MessageSent;
use App\Domain\Chat\Api\MessageState;
use App\Domain\Chat\Api\MessageView;
use App\Domain\Chat\Contracts\ConversationReader;
use App\Domain\Chat\Contracts\MessageSender;
use App\Domain\Chat\Exceptions\MessageBodyEmpty;
use App\Domain\Contracts\Domain;

final class ChatDomain implements Domain
{
    public function description(): string
    {
        return 'Messages between the user and agents; a question is a kind of message.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            MessageSent::class,
            MessageAnswered::class,
            MessageDismissed::class,
            ConversationReader::class,
            MessageSender::class,
            Conversation::class,
            MessageView::class,
            MessageState::class,
            MessageBodyEmpty::class,
        ];
    }
}
