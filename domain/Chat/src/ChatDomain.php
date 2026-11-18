<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesStates;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use Domain\Chat\Api\Conversation;
use Domain\Chat\Api\Events\MessageAnswered;
use Domain\Chat\Api\Events\MessageDismissed;
use Domain\Chat\Api\Events\MessageSent;
use Domain\Chat\Api\MessageView;
use Domain\Chat\Contracts\ConversationReader;
use Domain\Chat\Contracts\MessageSender;
use Domain\Chat\Enums\MessageState;
use Domain\Chat\Exceptions\MessageBodyEmpty;
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Readers\ChatWindowReader;
use Domain\Chat\Readers\ChosenAgentSection;
use Domain\Chat\States\Support\AnsweringMessageStateFactory;
use Domain\Chat\States\Support\AnsweringMessageStateReference;

final class ChatDomain implements Domain, ProvidesNavigation, ProvidesPages, ProvidesSections, ProvidesStates
{
    public function description(): string
    {
        return 'Messages between the user and agents; a question is a type of message.';
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
                ->slots(Slot::make('dock', SlotContextType::Session))
                ->actions(ActionRoute::post('messages', SendMessageController::class, 'send')),
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('conversation', 'Chat', Icon::Chat, position: 10)];
    }

    public function sections(): array
    {
        return [Section::make('agent', 'Agent', 'web.bar', SlotContextType::Session, ChosenAgentSection::class, 'ChosenAgent.vue')];
    }
}
