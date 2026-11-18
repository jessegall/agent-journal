<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
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
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Readers\ChatWindowReader;
use Domain\Chat\Readers\ChosenAgentSection;

final class ChatDomain extends Domain implements ProvidesNavigation, ProvidesPages, ProvidesSections
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
