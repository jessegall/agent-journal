<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Ui\Contracts\ProvidesNavigation;
use App\Core\Ui\Contracts\ProvidesPages;
use App\Core\Ui\Contracts\ProvidesSections;
use App\Core\Ui\Declarations\ActionRoute;
use App\Core\Ui\Declarations\NavigationItem;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Section;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\SlotContextType;
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
use App\Domain\Contracts\ProvidesStates;

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
