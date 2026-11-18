<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\CommandRegistry;
use App\Communication\Commands\SendMessage;
use App\Communication\Models\Message;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\CoreCommands;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesStates;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\States\Support\StateTypeRegistry;
use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Contracts\ProvidesNumberedModels;
use Domain\Chat\ChatDomain;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\TestCase;

/**
 * Messaging is Core: its commands, its answering state, its link type and its numbering are registered by Core, and
 * Chat, the conversation product, registers none of them, so messaging works with Chat switched off.
 */
final class CoreMessagingWithoutChatTest extends TestCase
{
    public function test_chat_registers_no_messaging_mechanics(): void
    {
        $chat = new ChatDomain();

        $this->assertNotInstanceOf(ProvidesCommands::class, $chat);
        $this->assertNotInstanceOf(ProvidesStates::class, $chat);
        $this->assertNotInstanceOf(ProvidesLinkRecords::class, $chat);
        $this->assertNotInstanceOf(ProvidesNumberedModels::class, $chat);
    }

    public function test_core_registers_the_messaging_mechanics(): void
    {
        $this->assertContains(SendMessage::class, CoreCommands::commands());
        $this->assertTrue($this->app->make(CommandRegistry::class)->has(SendMessage::class));
        $this->assertSame(Message::class, $this->app->make(LinkTypeRegistry::class)->modelFor(Message::LINK_TYPE));

        $states = new StateTypeRegistry();
        $this->app->make(Dispatcher::class)->dispatch(new StateTypesRequested($states));
        $this->assertTrue($states->has(AnsweringMessageStateReference::TYPE_KEY));
    }
}
