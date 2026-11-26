<?php

declare(strict_types=1);

namespace Tests\Unit\Communication;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Records\LinkRecordProvider;
use App\Contracts\Records\StateProvider;
use App\CoreCommands;
use App\Models\Messages\Message;
use App\Support\CommandRegistry;
use App\Support\Decisions\StateReferenceKeys;
use App\Support\LinkTypeRegistry;
use App\Support\Stack\StateTypes;
use App\Support\States\AnswerMessageState;
use App\Support\States\Support\AnswerMessageStateReference;
use Domain\Chat\ChatDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * Messaging is Core: its commands, its answering state, its link type and its numbering are registered by Core, and
 * Chat, the conversation product, registers none of them and no state, only its own pins and docks, so messaging
 * works with Chat switched off.
 */
final class CoreMessagingWithoutChatTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_chat_registers_no_messaging_mechanics(): void
    {
        $chat = new ChatDomain();

        $this->assertSame([], array_values(array_filter(
            $chat->commands(),
            fn (string $command) => str_starts_with($command, 'App\\Communication\\'),
        )));
        $this->assertNotInstanceOf(StateProvider::class, $chat);
        $this->assertNotInstanceOf(LinkRecordProvider::class, $chat);
    }

    public function test_core_registers_the_messaging_mechanics(): void
    {
        $this->assertContains(SendMessageCommand::class, CoreCommands::commands());
        $this->assertTrue($this->app->make(CommandRegistry::class)->has(SendMessageCommand::class));
        $this->assertSame(Message::class, $this->app->make(LinkTypeRegistry::class)->modelFor(Message::linkType()));

        $types = $this->app->make(StateTypes::class)->registry();
        $this->assertSame(AnswerMessageState::class, $types->get(StateReferenceKeys::of(AnswerMessageStateReference::class))->stateClass);
    }
}
