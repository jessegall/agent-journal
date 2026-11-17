<?php

declare(strict_types=1);

namespace App\Core\Hooks\Relay;

use App\Core\Agents\Support\AgentClientSettings;
use App\Core\Agents\Support\LaunchEnvironment;
use App\Core\Hooks\Enums\ReadyStateType;

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
        );
    }

    public function client(): AgentClientSettings
    {
        return new AgentClientSettings($this->journalUrl, $this->token, $this->timeoutSeconds);
    }
}
