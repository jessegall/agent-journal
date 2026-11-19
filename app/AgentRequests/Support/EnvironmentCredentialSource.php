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

    /**
     * @param  array<string, string>  $environment
     */
    public function __construct(private array $environment) {}

    /**
     * @throws LaunchSettingMissing
     * @throws LaunchCredentialRefused
     */
    public function forThisLaunch(): AgentClientSettings
    {
        $launch = new LaunchEnvironment($this->environment);
        $journalUrl = rtrim($this->usable($launch, 'JOURNAL_URL'), '/');
        $token = $this->usable($launch, 'JOURNAL_LAUNCH_TOKEN');

        if (parse_url($journalUrl, PHP_URL_SCHEME) !== 'https' && ! in_array(parse_url($journalUrl, PHP_URL_HOST), self::LOOPBACK_HOSTS, true)) {
            throw LaunchCredentialRefused::insecureUrl($journalUrl);
        }

        return new AgentClientSettings($journalUrl, $token, $this->profileOf($launch));
    }

    /**
     * The profile the launch was pinned to; a missing or malformed pin is refused like any other credential.
     *
     * @throws LaunchSettingMissing
     * @throws LaunchCredentialRefused
     */
    private function profileOf(LaunchEnvironment $launch): LaunchProfilePin
    {
        $key = $this->usable($launch, 'JOURNAL_PROFILE');
        $revision = $this->usable($launch, 'JOURNAL_PROFILE_REVISION');

        if (preg_match('/^[1-9][0-9]{0,8}$/', $revision) !== 1) {
            throw LaunchCredentialRefused::placeholder('JOURNAL_PROFILE_REVISION');
        }

        return new LaunchProfilePin($key, (int) $revision);
    }

    private function usable(LaunchEnvironment $launch, string $name): string
    {
        $value = $launch->value($name);

        if (trim($value) === '' || str_contains($value, '${') || str_contains($value, '<')) {
            throw LaunchCredentialRefused::placeholder($name);
        }

        return $value;
    }
}
