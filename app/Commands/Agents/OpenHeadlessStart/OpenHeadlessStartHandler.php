<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenHeadlessStart;

use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Support\Drivers\HeadlessStarts;
use App\Support\Drivers\Profiles\ClaudeCodeProfile;
use App\Support\StartClaims;
use App\Support\StartHeartbeats;
use App\Values\HostOrderSource;
use Illuminate\Support\Str;

final readonly class OpenHeadlessStartHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    private const string CHILD_UNCONFINED = "a connected child's headless turns cannot be confined to its checkout yet";

    public function __construct(
        private HeadlessStarts $headless,
        private StartHeartbeats $heartbeats,
        private StartClaims $claims,
        private ClaudeCodeProfile $profile,
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
        $probe = $this->profile->versionProbe($runtime->canonical_folder);
        $source = HostOrderSource::fromJournal();
        $open = new OpenHostProcessCommand($runtime->host_id, $runtime->id, $probe, $source, $start->id);

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
