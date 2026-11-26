<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\OpenAccountOwner\OpenAccountOwnerCommand;
use App\Agents\Commands\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Agents\Commands\OpenJournalTerminal\OpenJournalTerminalCommand;
use App\Agents\ContainerManifest;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Values\JournalServer;
use App\Bus\Contracts\JournalCommands;
use App\Exceptions\DriverUnknown;
use App\Hosts\Enums\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Profiles\StartProfilePin;
use App\Sessions\AgentClientSettings;
use App\Sessions\SessionContainers;
use App\Sessions\SessionOfflineReplies;
use App\Sessions\SessionTokens;
use App\Sessions\StartClaims;
use App\Skills\StartSkillFiles;
use App\Support\MountRules;
use App\Values\DriverAccount;
use App\Values\DriverRegistration;
use App\Values\DriverStart;

/**
 * The start of a headless Claude Code runtime the journal drives itself, as each of its processes runs it: in the
 * runtime's conversation and folder, on the start's account with the journal's server from the host's installation.
 */
final readonly class HeadlessStarts
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
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private StartClaims $starts,
        private DriverCatalogue $drivers,
        private JournalCommands $commands,
        private SessionTokens $tokens,
        private AccountOwners $owners,
        private SessionOfflineReplies $offlineReplies,
        private StartSkillFiles $skills,
        private SessionContainers $containers,
    ) {}

    /**
     * The journal opens what runs the headless runtime's next turn: its account's owner when its driver runs turns on
     * one, else a turn of its own when its start is proven, no turn runs and work waits.
     */
    public function openNextTurn(AgentRuntime $runtime): void
    {
        $open = $this->owners->serves($runtime)
            ? new OpenAccountOwnerCommand($runtime->id)
            : new OpenHeadlessTurnCommand($runtime->id);

        $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);
    }

    /**
     * The journal opens what a runtime whose start was just proven runs: its terminal, or its first turn.
     */
    public function openProven(AgentRuntime $runtime): void
    {
        if ($this->opensTerminal($runtime)) {
            $open = new OpenJournalTerminalCommand($runtime->id);
            $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);

            return;
        }

        $this->openNextTurn($runtime);
    }

    /**
     * How a process of the runtime signs in to the journal: the first takes the start's grant, each later one a fresh
     * token, as the process before it has ended.
     */
    public function clientSettingsOf(AgentRuntime $runtime): AgentClientSettings
    {
        $session = $runtime->session;
        $token = $runtime->claimStartGrant() ?? $this->tokens->rotate($session);
        $profile = new StartProfilePin($session->profile_key, $session->profile_revision);

        return new AgentClientSettings(self::JOURNAL_URL, $token, $profile);
    }

    /**
     * The keys of the drivers whose runtimes the journal drives itself, so no host claims their work.
     *
     * @return list<string>
     */
    public function drivenKeys(): array
    {
        $driven = array_filter(
            $this->drivers->catalogue(),
            fn (DriverRegistration $registration) => $registration->isDrivenByJournal,
        );

        return array_values(array_map(fn (DriverRegistration $registration) => $registration->key->key, $driven));
    }

    /**
     * Whether the journal drives this runtime itself, as its driver's registration says.
     */
    public function drives(AgentRuntime $runtime): bool
    {
        return in_array($runtime->driver_key, $this->drivenKeys(), true);
    }

    /**
     * Whether the runtime works in a terminal, which takes its work from its own driver worker, as its driver's
     * registration says.
     */
    public function opensTerminal(AgentRuntime $runtime): bool
    {
        return $this->registrationOf($runtime)->opensTerminal();
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
            isResume: $this->isResume($runtime),
            model: $model ?? $runtime->requested_model,
            effort: $effort ?? $runtime->requested_effort,
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
        $recipe = $this->starts->containedRecipeOf($start, MountRules::ACCOUNT_TARGET);
        $account = new DriverAccount($recipe, $runtime->id, new JournalServer(self::IMAGE_MCP_RELAY));

        return new DriverStart(
            sessionId: (string) $runtime->conversation_id,
            type: HostProcessType::Pipe,
            workFolder: ContainerManifest::WORKDIR,
            prompt: $prompt,
            isResume: $this->isResume($runtime),
            model: $model ?? $runtime->requested_model,
            effort: $effort ?? $runtime->requested_effort,
            hookCommand: self::IMAGE_HOOK_COMMAND,
            account: $account,
            executablePlace: ExecutablePlace::Image,
            offlineReply: $this->offlineReplies->of($start->session_id),
            skillFiles: $this->skills->of($start->session_id),
            container: $this->containers->of($runtime, $start),
        );
    }

    /**
     * A turn continues the conversation once a turn of it ran, or from its first turn when the owner chose to resume
     * it.
     */
    private function registrationOf(AgentRuntime $runtime): DriverRegistration
    {
        $registrations = array_filter(
            $this->drivers->catalogue(),
            fn (DriverRegistration $registration) => $registration->key->key === $runtime->driver_key,
        );

        return array_values($registrations)[0] ?? throw DriverUnknown::for($runtime->driver_key);
    }

    private function isResume(AgentRuntime $runtime): bool
    {
        return $runtime->hasRunTurn()
            || SessionRequest::resolveConversationTargetOf($runtime->agent_session_id) === $runtime->conversation_id;
    }
}
