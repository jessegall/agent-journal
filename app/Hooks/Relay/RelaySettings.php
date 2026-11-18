<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\LaunchEnvironment;
use App\Hooks\Enums\ReadyStateType;

/**
 * What the relay of one launch needs, given to the program's environment by the launch: where the journal
 * answers, the launch token, the agent's role and the host's bypass file.
 */
final readonly class RelaySettings
{
    public function __construct(
        public string $journalUrl,
        public string $token,
        public ReadyStateType $role,
        public string $bypassLogPath,
        public int $timeoutSeconds = 10,
        public int $processGeneration = 0,
    ) {}

    /**
     * @param  array<string, string>  $environment
     */
    public static function fromEnvironment(array $environment): self
    {
        $client = AgentClientSettings::fromEnvironment($environment);
        $launch = new LaunchEnvironment($environment);

        return new self(
            $client->journalUrl,
            $client->token,
            ReadyStateType::forKey($launch->value('JOURNAL_ROLE')),
            $launch->value('JOURNAL_BYPASS_LOG'),
            processGeneration: (int) ($environment['JOURNAL_PROCESS_GENERATION'] ?? 0),
        );
    }

    /**
     * The hook path, with the process generation the host gave this program when it has one, so the server can refuse
     * a call from an older process (doc 40, section 12).
     */
    public function hookPath(string $program): string
    {
        return $this->processGeneration > 0 ? "/hooks/{$program}?generation={$this->processGeneration}" : "/hooks/{$program}";
    }

    public function client(): AgentClientSettings
    {
        return new AgentClientSettings($this->journalUrl, $this->token, $this->timeoutSeconds);
    }
}
