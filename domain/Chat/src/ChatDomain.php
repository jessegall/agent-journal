<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Support\Domain;
use App\Autoload\Support\FolderClasses;
use App\Exports\Support\Exports;
use App\Skills\Contracts\ProvidesSkills;
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
use Domain\Chat\Enums\DockedRecordAbility;
use Domain\Chat\Enums\MessagePinAbility;
use Domain\Chat\Http\Controllers\CancelMessageController;
use Domain\Chat\Http\Controllers\ReadShownController;
use Domain\Chat\Http\Controllers\ReplyController;
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Http\Controllers\TakeNextController;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Policies\DockedRecordPolicy;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Resolvers\ChatWindowResolver;
use Domain\Chat\Resolvers\ChosenAgentSection;
use Domain\Chat\Resolvers\HistoryPageResolver;
use Domain\Chat\Resolvers\InboxPageResolver;
use Domain\Chat\Skills\ChatSkill;

final class ChatDomain extends Domain implements ProvidesCommands, ProvidesNavigation, ProvidesPages, ProvidesPolicies, ProvidesSections, ProvidesSkills
{
    public function description(): string
    {
        return 'The conversation product: the chat window, composer, chosen agent and docked records, built on Core messaging.';
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
        return Exports::make()->build();
    }

    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands', Command::class);
    }

    public function policies(): array
    {
        return [
            new PolicyRegistration(MessagePin::class, MessagePinPolicy::class, MessagePinAbility::class),
            new PolicyRegistration(DockedRecord::class, DockedRecordPolicy::class, DockedRecordAbility::class),
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
                SlotContextType::Session,
                ChosenAgentSection::class,
                'ChosenAgent.vue',
            ),
        ];
    }

    public function skills(): array
    {
        return [ChatSkill::class];
    }
}
