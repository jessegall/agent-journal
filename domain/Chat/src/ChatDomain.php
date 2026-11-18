<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasLinkRecords;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
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
use Domain\Chat\Commands\AnswerMessage;
use Domain\Chat\Commands\DismissMessage;
use Domain\Chat\Commands\RequireMessageAnswer;
use Domain\Chat\Commands\SendMessage;
use Domain\Chat\Contracts\ConversationReader;
use Domain\Chat\Enums\MessageState;
use Domain\Chat\Exceptions\MessageBodyEmpty;
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Links\MessageLinkRecords;
use Domain\Chat\Models\Message;
use Domain\Chat\Readers\ChatWindowReader;
use Domain\Chat\Readers\ChosenAgentSection;
use Domain\Chat\States\Support\AnsweringMessageStateFactory;
use Domain\Chat\States\Support\AnsweringMessageStateReference;

final class ChatDomain extends Domain implements ProvidesCommands, ProvidesLinkRecords, ProvidesNavigation, ProvidesNumberedModels, ProvidesPages, ProvidesSections, ProvidesStates
{
    use HasLinkRecords, HasNumberedModels, HasStates;

    public function description(): string
    {
        return 'Messages between the user and agents; a question is a type of message.';
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return [AnswerMessage::class, DismissMessage::class, RequireMessageAnswer::class, SendMessage::class];
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(MessageSent::class, MessageAnswered::class, MessageDismissed::class)
            ->contracts(ConversationReader::class)
            ->values(Conversation::class, MessageView::class, MessageState::class)
            ->commands(SendMessage::class)
            ->exceptions(MessageBodyEmpty::class)
            ->build();
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

    public function linkRecords(): array
    {
        return [Message::LINK_TYPE => MessageLinkRecords::class];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(Message::class)];
    }
}
