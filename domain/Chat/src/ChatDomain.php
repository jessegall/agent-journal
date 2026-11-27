<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Contracts\Events\EngineListenerProvider;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageLoaders;
use App\Declarations\PageSlots;
use App\Mcp\Contracts\McpToolProvider;
use App\Messages\MessageSearchAccess;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Contracts\SectionProvider;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Search\Contracts\MessageSearch;
use App\Skills\Contracts\SkillProvider;
use App\Support\Codebase;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\Searchable;
use App\Text\Declarations\Section;
use Domain\Chat\Contracts\PairChats;
use Domain\Chat\Events\ChatMessageChanged;
use Domain\Chat\Events\DockChanged;
use Domain\Chat\Http\Controllers\AnswerQuestionController;
use Domain\Chat\Http\Controllers\DockController;
use Domain\Chat\Http\Controllers\Membership\AddParticipantController;
use Domain\Chat\Http\Controllers\Membership\CloseChatController;
use Domain\Chat\Http\Controllers\Membership\CreateGroupChatController;
use Domain\Chat\Http\Controllers\Membership\LeaveChatController;
use Domain\Chat\Http\Controllers\Membership\RemoveParticipantController;
use Domain\Chat\Http\Controllers\Membership\TransferChatController;
use Domain\Chat\Http\Controllers\ReactController;
use Domain\Chat\Http\Controllers\ReadShownController;
use Domain\Chat\Http\Controllers\SendMessageController;
use Domain\Chat\Http\Controllers\UndockController;
use Domain\Chat\Http\Loaders\ChatCandidatesLoader;
use Domain\Chat\Http\Loaders\ChatRowsLoader;
use Domain\Chat\Http\Loaders\StartDriversLoader;
use Domain\Chat\Http\Pages\Resolvers\ChatWindowResolver;
use Domain\Chat\Http\Pages\Resolvers\ChosenAgentSection;
use Domain\Chat\Policies\DockPlacementPolicy;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Support\Skills\ChatSkill;
use Domain\Questions\QuestionsDomain;
use Domain\Sequences\SequencesDomain;

final class ChatDomain extends Domain implements
    CommandProvider,
    EngineListenerProvider,
    McpToolProvider,
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
        return [
            SequencesDomain::class,
            QuestionsDomain::class,
        ];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(DockChanged::class, ChatMessageChanged::class)
            ->contracts(PairChats::class)
            ->build();
    }

    public function engineListeners(): array
    {
        return [];
    }

    public function commands(): array
    {
        return Codebase::in(__DIR__.'/Commands/*', Command::class);
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                MessagePinPolicy::class,
                [AccessType::Edit],
            ),
            new PolicyDefinition(
                DockPlacementPolicy::class,
                [AccessType::Edit],
            ),
        ];
    }

    public function pages(): array
    {
        return [
            Page::make('conversation', 'Chat', Icon::Speech, ChatWindowResolver::class, 'ChatWindow.vue')
                ->at('')
                ->onHome(10)
                ->slots(fn (PageSlots $slots) => $slots->add('dock', SlotContextType::Session))
                ->actions(fn (PageActions $actions) => $actions
                    ->post('messages', SendMessageController::class, 'send')
                    ->post('messages/read', ReadShownController::class, 'read')
                    ->post('messages/react', ReactController::class, 'react')
                    ->post('questions/answer', AnswerQuestionController::class, 'answer')
                    ->post('dock', DockController::class, 'dock')
                    ->post('dock/remove', UndockController::class, 'undock')
                    ->post('chats', CreateGroupChatController::class, 'create-group')
                    ->post('chats/members', AddParticipantController::class, 'add-member')
                    ->post('chats/members/remove', RemoveParticipantController::class, 'remove-member')
                    ->post('chats/transfer', TransferChatController::class, 'transfer')
                    ->post('chats/leave', LeaveChatController::class, 'leave')
                    ->post('chats/close', CloseChatController::class, 'close'))
                ->loaders(fn (PageLoaders $loaders) => $loaders
                    ->add('rows', ChatRowsLoader::class)
                    ->add('candidates', ChatCandidatesLoader::class)
                    ->add('start-drivers', StartDriversLoader::class)),
        ];
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
        return [];
    }

    public function overviewContributions(): array
    {
        return [];
    }

    /**
     * Chat messages, searched and opened under the message visibility scope.
     */
    public function searchables(): array
    {
        return [Searchable::make('message', 'Messages', MessageSearchAccess::class, MessageSearch::class)];
    }
}
