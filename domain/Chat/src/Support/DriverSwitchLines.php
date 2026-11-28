<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Contracts\RequestKey;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Support\ActorReference;

/**
 * The one chat line a driver switch writes in the chat of the user who asked for it, posted by the journal: what it
 * switched from and to and what the new session read, or why it failed and that the agent stays on its old driver. A
 * new driver's session that carries the chat over is asked there to read it first and say where it runs now.
 */
final readonly class DriverSwitchLines
{
    private const string TRUSTED_ENTRY = 'driver switch';

    public function __construct(
        private PairChats $chats,
        private JournalCommands $journal,
        private RequestKey $requestKey,
    ) {}

    public function switched(DriverSwitch $switch): void
    {
        $expected = AgentSession::query()->find($switch->expected_session_id);
        $from = $this->labelOf($expected, $switch);
        $replacement = AgentSession::query()->find($switch->replacement_session_id);
        $to = $this->labelOf($replacement, $switch);
        $agent = Agent::query()->findOrFail($switch->agent_id);

        $read = match (true) {
            $switch->conversation_id !== null => 'the same session and conversation',
            $switch->carries_conversation => 'the new session reads this chat and the memories. '
                ."{$agent->name}: read this chat's history and your memories first, then say you now run on {$to}",
            default => 'the new session read only the memories',
        };

        $this->post($switch, "Switched from {$from} to {$to} · {$read}.");
    }

    public function failed(DriverSwitch $switch, string $reason): void
    {
        $expected = AgentSession::query()->find($switch->expected_session_id);
        $from = $this->labelOf($expected, $switch);
        $agent = Agent::query()->findOrFail($switch->agent_id);

        $this->post($switch, "The switch to {$switch->target_family} failed: {$reason} {$agent->name} stays on {$from}.");
    }

    // A session as the line names it: its driver and model, else the switch's target when the session is unknown.
    private function labelOf(AgentSession|null $session, DriverSwitch $switch): string
    {
        if ($session === null) {
            return "{$switch->target_family} · {$switch->model}";
        }

        return "{$session->driver_label} · {$session->model}";
    }

    private function post(DriverSwitch $switch, string $text): void
    {
        $chat = $this->chats->existingBetween(
            ActorReference::ofClass(User::class, $switch->requested_by),
            ActorReference::ofClass(Agent::class, $switch->agent_id),
        );

        if ($chat === null) {
            return;
        }

        $this->requestKey->independently(
            "driver-switch-{$switch->id}",
            fn () => $this->journal->runAsJournal(
                CommandEntry::Application,
                self::TRUSTED_ENTRY,
                new SendMessageCommand($chat->id, $text),
            ),
        );
    }
}
