<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Agents\ContainerManifest;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Values\JournalServer;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Profiles\StartProfilePin;
use App\Sessions\AgentClientSettings;
use App\Sessions\SessionContainers;
use App\Sessions\SessionOfflineReplies;
use App\Sessions\SessionTokens;
use App\Sessions\StartClaims;
use App\Skills\StartSkillFiles;
use App\Support\HelperMounts;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use Illuminate\Container\Attributes\Config;

/**
 * The start of any process the journal opens for a runtime, a turn, a terminal or a probe, as that process runs it: in
 * the runtime's conversation and folder, on the start's account with the journal's server from the host's installation.
 */
final readonly class RuntimeStarts
{
    /**
     * Where the host's protected installation keeps the journal's PHP and its MCP relay, and its hook command.
     */
    private const string INSTALLED_PHP = '{host:INSTALLATION}/bin/php';

    private const string INSTALLED_MCP_RELAY = '{host:INSTALLATION}/journal/bin/journal-mcp';

    private const string HOOK_COMMAND = '{host:HOOK_COMMAND}';

    /**
     * The hook adapter and the MCP relay of the agent image a contained start runs in.
     */
    private const string IMAGE_HOOK_COMMAND = '/opt/journal/bin/journal-hook';

    private const string IMAGE_MCP_RELAY = '/opt/journal/bin/journal-mcp';

    private const string JOURNAL_URL = '{host:JOURNAL_URL}';

    /**
     * The trusted entry the journal's own commands for headless starts run under.
     */
    public function __construct(
        private StartClaims $starts,
        private SessionTokens $tokens,
        private SessionOfflineReplies $offlineReplies,
        private StartSkillFiles $skills,
        private SessionContainers $containers,
        #[Config('journal.agents.session_journal_url')]
        private string $sessionJournalUrl,
    ) {}

    /**
     * How a process of the runtime signs in to the journal: the first takes the start's grant, each later one a fresh
     * token, as the process before it has ended. A contained process reaches the journal at the session address, as
     * its plan names nothing of the host; one the host runs itself is given the host's own address.
     */
    public function clientSettingsOf(AgentRuntime $runtime): AgentClientSettings
    {
        $session = $runtime->loadMissing('session')->session;
        $token = $runtime->claimStartGrant() ?? $this->tokens->rotate($session);
        $profile = new StartProfilePin($session->profile_key, $session->profile_revision);

        $isContained = $runtime->executablePlace() === ExecutablePlace::Image;
        $journalUrl = $isContained ? $this->sessionJournalUrl : self::JOURNAL_URL;

        return new AgentClientSettings($journalUrl, $token, $profile);
    }

    /**
     * The account folder as the runtime's driver sees it: the account home its container mounts, or the account's
     * own folder on the host, so what the driver reports as its folder is checked against the right one.
     */
    public function accountFolderSeenBy(AgentRuntime $runtime, SessionProcess $start): string
    {
        if ($runtime->executablePlace() === ExecutablePlace::Image) {
            return HelperMounts::ACCOUNT_TARGET;
        }

        return $start->directory;
    }

    public function startOf(
        AgentRuntime $runtime,
        SessionProcess $start,
        string|null $prompt = null,
        string|null $model = null,
        string|null $effort = null,
    ): DriverStart {
        $place = $runtime->executablePlace();

        if ($place === ExecutablePlace::Image) {
            return $this->containedStartOf($runtime, $start, $prompt, $model, $effort);
        }

        $server = new JournalServer(self::INSTALLED_PHP, self::INSTALLED_MCP_RELAY);
        $account = new DriverAccount($this->starts->recipeOf($start), $runtime->id, $server, folder: $start->directory);

        return new DriverStart(
            sessionId: (string) $runtime->conversation_id,
            type: HostProcessType::Pipe,
            workFolder: $runtime->canonical_folder,
            prompt: $prompt,
            isResume: $runtime->continuesConversation(HostProcessPurpose::AgentTurn),
            model: $model ?? $runtime->startModel(),
            effort: $effort ?? $runtime->startEffort(),
            hookCommand: self::HOOK_COMMAND,
            account: $account,
            executablePlace: $runtime->executablePlace(),
            offlineReply: $this->offlineReplies->of($start->session_id),
            skillFiles: $this->skills->of($start->session_id),
        );
    }

    /**
     * The start in its own container of the agent image: the account folder as the container mounts it, the image's
     * hook adapter and MCP relay, and no folder of the host.
     */
    private function containedStartOf(
        AgentRuntime $runtime,
        SessionProcess $start,
        string|null $prompt,
        string|null $model,
        string|null $effort,
    ): DriverStart {
        $recipe = $this->starts->containedRecipeOf($start, $this->accountFolderSeenBy($runtime, $start));
        $account = new DriverAccount($recipe, $runtime->id, new JournalServer(self::IMAGE_MCP_RELAY));

        return new DriverStart(
            sessionId: (string) $runtime->conversation_id,
            type: HostProcessType::Pipe,
            workFolder: ContainerManifest::WORKDIR,
            prompt: $prompt,
            isResume: $runtime->continuesConversation(HostProcessPurpose::AgentTurn),
            model: $model ?? $runtime->startModel(),
            effort: $effort ?? $runtime->startEffort(),
            hookCommand: self::IMAGE_HOOK_COMMAND,
            account: $account,
            executablePlace: ExecutablePlace::Image,
            offlineReply: $this->offlineReplies->of($start->session_id),
            skillFiles: $this->skills->of($start->session_id),
            container: $this->containers->of($runtime, $start),
        );
    }
}
