<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Where a started driver reaches the journal and the token it signs its calls with, both given to its environment
 * by the start.
 */
final readonly class AgentClientSettings
{
    /**
     * The variables a started process reads its credentials from, the same for every entry point: journal-hook,
     * journal-mcp, the journal command and mcp:relay.
     */
    public const string JOURNAL_URL = 'JOURNAL_URL';

    public const string START_TOKEN = 'JOURNAL_START_TOKEN';

    public const string PROFILE = 'JOURNAL_PROFILE';

    public const string PROFILE_REVISION = 'JOURNAL_PROFILE_REVISION';

    public function __construct(
        public string $journalUrl,
        public string $token,
        public StartProfilePin $profile,
        public int $timeoutSeconds = 10,
    ) {}

    /**
     * The credentials as the environment of a process the journal orders opened, each variable as NAME=value.
     *
     * @return list<string>
     */
    public function environment(): array
    {
        return [
            self::JOURNAL_URL.'='.$this->journalUrl,
            self::START_TOKEN.'='.$this->token,
            self::PROFILE.'='.$this->profile->key,
            self::PROFILE_REVISION.'='.$this->profile->revision,
        ];
    }
}
