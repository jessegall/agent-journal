<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\SessionTokenSource;
use App\Exceptions\SessionTokenRefused;
use App\Exceptions\StartSettingMissing;

/**
 * The start token read from JOURNAL_URL and JOURNAL_START_TOKEN in the driver's environment, refused when a
 * value is missing or a placeholder, or when the address leaves this machine without HTTPS.
 */
final readonly class EnvironmentCredentialSource implements SessionTokenSource
{
    private const array LOOPBACK_HOSTS = [
        'localhost',
        '127.0.0.1',
        '::1',
        '[::1]',
    ];

    public function __construct(private StartEnvironment $start) {}

    /**
     * @throws StartSettingMissing
     * @throws SessionTokenRefused
     */
    public function forThisStart(): AgentClientSettings
    {
        $journalUrl = rtrim($this->usable('JOURNAL_URL'), '/');
        $token = $this->usable('JOURNAL_START_TOKEN');

        if (parse_url($journalUrl, PHP_URL_SCHEME) !== 'https'
            && ! in_array(parse_url($journalUrl, PHP_URL_HOST), self::LOOPBACK_HOSTS, true)) {
            throw SessionTokenRefused::insecureUrl($journalUrl);
        }

        return new AgentClientSettings($journalUrl, $token, $this->profile());
    }

    /**
     * The profile the start was pinned to; a missing or malformed pin is refused like any other credential.
     *
     * @throws StartSettingMissing
     * @throws SessionTokenRefused
     */
    private function profile(): StartProfilePin
    {
        $key = $this->usable('JOURNAL_PROFILE');
        $revision = $this->usable('JOURNAL_PROFILE_REVISION');

        if (preg_match('/^[1-9][0-9]{0,8}$/', $revision) !== 1) {
            throw SessionTokenRefused::placeholder('JOURNAL_PROFILE_REVISION');
        }

        return new StartProfilePin($key, (int) $revision);
    }

    private function usable(string $name): string
    {
        $credential = $this->start->value($name);

        if (trim($credential) === '' || str_contains($credential, '${') || str_contains($credential, '<')) {
            throw SessionTokenRefused::placeholder($name);
        }

        return $credential;
    }
}
