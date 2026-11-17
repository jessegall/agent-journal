<?php

declare(strict_types=1);

namespace App\Core\Hooks\Relay;

use App\Core\Hooks\States\ReadyStateType;

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
        $read = fn (string $name): string => $environment[$name] ?? throw RelaySettingMissing::forName($name);

        return new self(
            rtrim($read('JOURNAL_URL'), '/'),
            $read('JOURNAL_LAUNCH_TOKEN'),
            ReadyStateType::forKey($read('JOURNAL_ROLE')),
            $read('JOURNAL_BYPASS_LOG'),
        );
    }
}
