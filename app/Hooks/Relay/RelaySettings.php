<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\LaunchEnvironment;
use App\AgentRequests\Support\LaunchProfilePin;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Exceptions\OfflineReplySealInvalid;
use App\Agents\Support\OfflineReplySeal;

/**
 * What the relay of one launch needs, given to the program's environment by the launch: where the journal
 * answers, the launch token, the sealed offline reply and the host's bypass file.
 */
final readonly class RelaySettings
{
    public function __construct(
        public string $journalUrl,
        public string $token,
        public LaunchProfilePin $profile,
        public bool $passesOutages,
        public string $bypassLogPath,
        public int $timeoutSeconds = 10,
        public int $processGeneration = 0,
    ) {}

    /**
     * The launch's credential with the offline reply and bypass file its environment names; the reply counts only
     * under the seal the journal issued for this launch.
     *
     * @param  array<string, string>  $environment
     *
     * @throws OfflineReplySealInvalid
     */
    public static function forLaunch(AgentClientSettings $client, array $environment, OfflineReplySeal $seal): self
    {
        $launch = new LaunchEnvironment($environment);
        $mode = OfflineReplyMode::fromLaunch($launch->value('JOURNAL_OFFLINE_REPLY'));
        $seal->verify($client->token, $client->profile, $mode, $launch->value('JOURNAL_OFFLINE_REPLY_SEAL'));

        return new self(
            $client->journalUrl,
            $client->token,
            $client->profile,
            $mode->passesOutages(),
            $launch->value('JOURNAL_BYPASS_LOG'),
            processGeneration: (int) ($environment['JOURNAL_PROCESS_GENERATION'] ?? 0),
        );
    }

    /**
     * The hook path, with the process generation the host gave this program when it has one, so the server can refuse
     * a call from an older process (doc 40, section 12).
     *
     * The folder of callback envelopes not yet answered, beside the bypass log.
     */
    public function pendingEnvelopesFolder(): string
    {
        return $this->bypassLogPath.'.pending';
    }

    public function hookPath(string $program): string
    {
        $query = $this->processGeneration > 0 ? ['generation' => $this->processGeneration] : [];

        return route('hooks.answer', ['program' => $program, ...$query], false);
    }

    public function client(): AgentClientSettings
    {
        return new AgentClientSettings($this->journalUrl, $this->token, $this->profile, $this->timeoutSeconds);
    }
}
