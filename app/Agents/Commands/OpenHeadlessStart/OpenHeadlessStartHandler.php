<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenHeadlessStart;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\ProbeClaimedStart\ProbeClaimedStartCommand;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Sessions\StartClaims;
use App\Sessions\StartHeartbeats;
use Illuminate\Support\Str;

final readonly class OpenHeadlessStartHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    private const string CHILD_UNCONFINED = "a connected child's headless turns cannot be confined to its checkout yet";

    public function __construct(
        private HeadlessStarts $headless,
        private StartHeartbeats $heartbeats,
        private StartClaims $claims,
        private JournalCommands $commands,
    ) {}

    public function handle(OpenHeadlessStartCommand $command): string|null
    {
        $runtime = AgentRuntime::findForSession($command->sessionId);

        if ($runtime === null || ! $this->headless->drives($runtime)) {
            return null;
        }

        $claimed = $this->claims->claim($runtime->host_id, $command->sessionId);

        if ($claimed === null) {
            return null;
        }

        $session = $runtime->session()->sole();
        $start = SessionProcess::findClaimedBy($runtime->host_id, $claimed->startKey);

        // A connected child's turns must run confined to its own checkout, which the journal cannot plan yet; the
        // start is refused rather than run unconfined.
        if ($session->parent_session_id !== null) {
            $this->heartbeats->refuseStart($start, self::CHILD_UNCONFINED);

            return null;
        }

        // A resume continues the conversation the owner chose; any other start begins one of its own.
        $runtime->chooseConversation($claimed->conversationTarget ?? (string) Str::uuid());
        $probe = new ProbeClaimedStartCommand($start->id);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $probe);

        return $start->id;
    }
}
