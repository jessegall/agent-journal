<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Domain\Chat\Api\Conversation;
use App\Domain\Chat\Api\Events\MessageAnswered;
use App\Domain\Chat\Api\Events\MessageDismissed;
use App\Domain\Chat\Api\Events\MessageSent;
use App\Domain\Chat\Api\MessageView;
use App\Domain\Chat\Contracts\ConversationReader;
use App\Domain\Chat\Contracts\MessageSender;
use App\Domain\Chat\Enums\MessageState;
use App\Domain\Chat\Exceptions\MessageBodyEmpty;
use App\Domain\Chat\Http\Controllers\SendMessageController;
use App\Domain\Chat\Readers\ChatWindowReader;
use App\Domain\Chat\Readers\ChosenAgentSection;
use App\Domain\Chat\States\Support\AnsweringMessageStateFactory;
use App\Domain\Chat\States\Support\AnsweringMessageStateReference;
use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesNavigation;
use App\Domain\Contracts\ProvidesPages;
use App\Domain\Contracts\ProvidesSections;
use App\Domain\Contracts\ProvidesStates;
use App\Domain\Declarations\ActionRoute;
use App\Domain\Declarations\NavigationItem;
use App\Domain\Declarations\Page;
use App\Domain\Declarations\Section;
use App\Domain\Declarations\Slot;
use App\Domain\Enums\Icon;
use App\Domain\Enums\SlotContextKind;

final class ChatDomain implements Domain, ProvidesNavigation, ProvidesPages, ProvidesSections, ProvidesStates
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

    public function states(): array
    {
        return [AnsweringMessageStateReference::TYPE_KEY => AnsweringMessageStateFactory::class];
    }

    public function pages(): array
    {
        return [
            Page::make('conversation', 'Chat', Icon::Chat, ChatWindowReader::class, 'ChatWindow.vue')
                ->at('')
                ->onHome(10)
                ->slots(Slot::make('dock', SlotContextKind::Session))
                ->actions(ActionRoute::post('messages', SendMessageController::class, 'send')),
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('conversation', 'Chat', Icon::Chat, position: 10)];
    }

    public function sections(): array
    {
        return [Section::make('agent', 'Agent', 'web.bar', SlotContextKind::Session, ChosenAgentSection::class, 'ChosenAgent.vue')];
    }
}
