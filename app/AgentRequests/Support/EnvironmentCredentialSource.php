<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Contracts\LaunchCredentialSource;
use App\AgentRequests\Exceptions\LaunchCredentialRefused;
use App\AgentRequests\Exceptions\LaunchSettingMissing;

/**
 * The launch credential read from JOURNAL_URL and JOURNAL_LAUNCH_TOKEN in the program's environment, refused when a
 * value is missing or a placeholder, or when the address leaves this machine without HTTPS.
 */
final readonly class EnvironmentCredentialSource implements LaunchCredentialSource
{
    private const array LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '::1', '[::1]'];

    public function __construct(private LaunchEnvironment $launch) {}

    /**
     * @throws LaunchSettingMissing
     * @throws LaunchCredentialRefused
     */
    public function forThisLaunch(): AgentClientSettings
    {
        $journalUrl = rtrim($this->usable('JOURNAL_URL'), '/');
        $token = $this->usable('JOURNAL_LAUNCH_TOKEN');

        if (parse_url($journalUrl, PHP_URL_SCHEME) !== 'https'
            && ! in_array(parse_url($journalUrl, PHP_URL_HOST), self::LOOPBACK_HOSTS, true)) {
            throw LaunchCredentialRefused::insecureUrl($journalUrl);
        }

        return new AgentClientSettings($journalUrl, $token, $this->profile());
    }

    /**
     * The profile the launch was pinned to; a missing or malformed pin is refused like any other credential.
     *
     * @throws LaunchSettingMissing
     * @throws LaunchCredentialRefused
     */
    private function profile(): LaunchProfilePin
    {
        $key = $this->usable('JOURNAL_PROFILE');
        $revision = $this->usable('JOURNAL_PROFILE_REVISION');

        if (preg_match('/^[1-9][0-9]{0,8}$/', $revision) !== 1) {
            throw LaunchCredentialRefused::placeholder('JOURNAL_PROFILE_REVISION');
        }

        return new LaunchProfilePin($key, (int) $revision);
    }

    private function usable(string $name): string
    {
        $value = $this->launch->value($name);

        if (trim($value) === '' || str_contains($value, '${') || str_contains($value, '<')) {
            throw LaunchCredentialRefused::placeholder($name);
        }

        return $value;
    }
}
