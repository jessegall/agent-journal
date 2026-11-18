<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

/**
 * Where a launched program reaches the journal and the token it signs its calls with, both given to its environment
 * by the launch.
 */
final readonly class AgentClientSettings
{
    public function __construct(
        public string $journalUrl,
        public string $token,
        public int $timeoutSeconds = 10,
    ) {}

    /**
     * @param  array<string, string>  $environment
     */
    public static function fromEnvironment(array $environment): self
    {
        $launch = new LaunchEnvironment($environment);

        return new self(rtrim($launch->value('JOURNAL_URL'), '/'), $launch->value('JOURNAL_LAUNCH_TOKEN'));
    }
}
