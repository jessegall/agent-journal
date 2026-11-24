<?php

declare(strict_types=1);

namespace Domain\Chat;

use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Events\EngineListenerProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Navigation\SectionProvider;
use App\Contracts\Search\MessageSearch;
use App\Contracts\Skills\SkillProvider;
use App\Declarations\ActionRoute;
use App\Declarations\Page;
use App\Declarations\Section;
use App\Declarations\Slot;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Enums\SlotContextType;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Support\MessageSearchAccess;
use App\Support\Searchable;
use App\Values\PolicyDefinition;
use Domain\Chat\Events\ChatReconciled;
use Domain\Chat\Events\ChatReconcileMarked;
use Domain\Chat\Events\DockChanged;
use Domain\Chat\Http\Controllers\CancelMessageController;
use Domain\Chat\Http\Controllers\ChatEventsController;
use Domain\Chat\Http\Controllers\ChatRowsController;
use Domain\Chat\Http\Controllers\DeclineQuestionController;
use Domain\Chat\Http\Controllers\DockController;
use Domain\Chat\Http\Controllers\Membership\AddParticipantController;
use Domain\Chat\Http\Controllers\Membership\ChatCandidatesController;
use Domain\Chat\Http\Controllers\Membership\CloseChatController;
use Domain\Chat\Http\Controllers\Membership\CreateGroupChatController;
use Domain\Chat\Http\Controllers\Membership\LeaveChatController;
use Domain\Chat\Http\Controllers\Membership\RemoveParticipantController;
use Domain\Chat\Http\Controllers\Membership\TransferChatController;
use Domain\Chat\Http\Controllers\ReactController;
use Domain\Chat\Http\Controllers\ReadShownController;
use Domain\Chat\Http\Controllers\ReplyController;
use Domain\Chat\Http\Controllers\RequestOutcomeController;
use Domain\Chat\Http\Controllers\RetryDeliveryController;
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Http\Controllers\TakeNextController;
use Domain\Chat\Http\Controllers\UndockController;
use Domain\Chat\Http\Pages\Resolvers\ChatWindowResolver;
use Domain\Chat\Http\Pages\Resolvers\ChosenAgentSection;
use Domain\Chat\Http\Pages\Resolvers\HistoryPageResolver;
use Domain\Chat\Http\Pages\Resolvers\InboxPageResolver;
use Domain\Chat\Mcp\Resources\MessageResource;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Policies\MessageReactionPolicy;
use Domain\Chat\Support\Mcp\PendingMessagesOverview;
use Domain\Chat\Support\SettleMarkedChatsOnTick;
use Domain\Chat\Support\Skills\ChatSkill;

final class ChatDomain extends Domain implements
    CommandProvider,
    EngineListenerProvider,
    McpToolProvider,
    NativePartProvider,
    PageProvider,
    PolicyProvider,
    SectionProvider,
    SkillProvider
{
    public function description(): string
    {
        return 'The conversation product: the chat window, composer, chosen agent and the sources docked in a conversation, built on Core messaging.';
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
            ->events(DockChanged::class, ChatReconcileMarked::class, ChatReconciled::class)
            ->commands(OpenPairChatCommand::class)
            ->build();
    }

    public function engineListeners(): array
    {
        return [SettleMarkedChatsOnTick::class];
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                MessagePinPolicy::class,
                [AccessType::Edit],
            ),
            new PolicyDefinition(
                MessageReactionPolicy::class,
                [AccessType::Edit],
            ),
            new PolicyDefinition(
                ConversationPolicy::class,
                [AccessType::Edit],
            ),
        ];
    }

    public function pages(): array
    {
        return [
            Page::make('conversation', 'Chat', Icon::Chat, ChatWindowResolver::class, 'ChatWindow.vue')
                ->at('')
                ->onHome(10)
                ->slots(Slot::make('dock', SlotContextType::Session))
                ->actions(
                    ActionRoute::post('messages', SendMessageController::class, 'send'),
                    ActionRoute::post('messages/read', ReadShownController::class, 'read'),
                    ActionRoute::post('messages/reply', ReplyController::class, 'reply'),
                    ActionRoute::post('messages/decline', DeclineQuestionController::class, 'decline'),
                    ActionRoute::post('messages/react', ReactController::class, 'react'),
                    ActionRoute::post('messages/retry-delivery', RetryDeliveryController::class, 'retry-delivery'),
                    ActionRoute::get('messages/outcome', RequestOutcomeController::class, 'outcome'),
                    ActionRoute::get('events', ChatEventsController::class, 'events'),
                    ActionRoute::get('messages/rows', ChatRowsController::class, 'rows'),
                    ActionRoute::post('dock', DockController::class, 'dock'),
                    ActionRoute::post('dock/remove', UndockController::class, 'undock'),
                    ActionRoute::post('chats', CreateGroupChatController::class, 'create-group'),
                    ActionRoute::get('chats/candidates', ChatCandidatesController::class, 'candidates'),
                    ActionRoute::post('chats/members', AddParticipantController::class, 'add-member'),
                    ActionRoute::post('chats/members/remove', RemoveParticipantController::class, 'remove-member'),
                    ActionRoute::post('chats/transfer', TransferChatController::class, 'transfer'),
                    ActionRoute::post('chats/leave', LeaveChatController::class, 'leave'),
                    ActionRoute::post('chats/close', CloseChatController::class, 'close'),
                ),
            Page::layout('inbox', 'Inbox', Icon::Chat, InboxPageResolver::class)
                ->at('inbox')
                ->actions(ActionRoute::post('inbox/take-next', TakeNextController::class, 'take-next')),
            Page::layout('history', 'History', Icon::Chat, HistoryPageResolver::class)
                ->at('history')
                ->actions(ActionRoute::post('history/cancel', CancelMessageController::class, 'cancel')),
        ];
    }

    /**
     * The native part the Inbox layout mounts: one inbox's newest messages.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['InboxMessages.vue'];
    }

    public function sections(): array
    {
        return [
            Section::make(
                'agent',
                'Agent',
                'web.bar',
                SlotContextType::Nothing,
                ChosenAgentSection::class,
                'ChosenAgent.vue',
            ),
        ];
    }

    public function skills(): array
    {
        return [ChatSkill::class];
    }

    public function mcpResources(): array
    {
        return [MessageResource::class];
    }

    public function overviewContributions(): array
    {
        return [PendingMessagesOverview::class];
    }

    /**
     * Chat messages, searched and opened under the message visibility scope.
     */
    public function searchables(): array
    {
        return [Searchable::make('message', 'Messages', MessageSearchAccess::class, MessageSearch::class)];
    }
}
