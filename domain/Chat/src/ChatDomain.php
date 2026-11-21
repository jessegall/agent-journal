<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyRegistration;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use App\Operations\Enums\AccessType;
use App\Skills\Contracts\SkillProvider;
use App\Ui\Contracts\NavigationProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Contracts\SectionProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use Domain\Chat\Events\DockChanged;
use Domain\Chat\Http\Controllers\CancelMessageController;
use Domain\Chat\Http\Controllers\DockController;
use Domain\Chat\Http\Controllers\ReadShownController;
use Domain\Chat\Http\Controllers\ReplyController;
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Http\Controllers\TakeNextController;
use Domain\Chat\Http\Controllers\UndockController;
use Domain\Chat\Mcp\MessageResource;
use Domain\Chat\Mcp\MessageSearch;
use Domain\Chat\Mcp\PendingMessagesOverview;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Resolvers\ChatWindowResolver;
use Domain\Chat\Resolvers\ChosenAgentSection;
use Domain\Chat\Resolvers\HistoryPageResolver;
use Domain\Chat\Resolvers\InboxPageResolver;
use Domain\Chat\Skills\ChatSkill;

final class ChatDomain extends Domain implements
    CommandProvider,
    McpToolProvider,
    NavigationProvider,
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
        return Exports::make()->events(DockChanged::class)->build();
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands', Command::class);
    }

    public function policies(): array
    {
        return [
            new PolicyRegistration(
                MessagePinPolicy::class,
                [AccessType::Edit],
            ),
            new PolicyRegistration(
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
                    ActionRoute::post('dock', DockController::class, 'dock'),
                    ActionRoute::post('dock/remove', UndockController::class, 'undock'),
                ),
            Page::make('inbox', 'Inbox', Icon::Chat, InboxPageResolver::class, 'Inbox.vue')
                ->at('inbox')
                ->actions(ActionRoute::post('inbox/take-next', TakeNextController::class, 'take-next')),
            Page::make('history', 'History', Icon::Chat, HistoryPageResolver::class, 'History.vue')
                ->at('history')
                ->actions(ActionRoute::post('history/cancel', CancelMessageController::class, 'cancel')),
        ];
    }

    public function navigation(): array
    {
        return [NavigationItem::page('conversation', 'Chat', Icon::Chat, position: 10)];
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

    public function searchContributions(): array
    {
        return [MessageSearch::class];
    }
}
