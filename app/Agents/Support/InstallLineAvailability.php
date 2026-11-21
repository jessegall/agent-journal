<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Settings\Contracts\SettingsResolver;
use App\Settings\Support\CoreSettings;

/**
 * Whether this server may issue install lines that connect a project on another machine: the owner switched remote
 * projects on, the configured canonical origin is https, and a published release speaks a protocol it speaks.
 * Enrolled hosts, contained or local, never ask it.
 */
final readonly class InstallLineAvailability
{
    public function __construct(
        private SettingsResolver $settings,
        private CoreSettings $core,
        private PublishedReleases $releases,
        private ServerOrigin $origin,
    ) {}

    public function canIssue(): bool
    {
        return $this->settings->boolean($this->core->remoteProjects)
            && $this->origin->isHttps()
            && $this->releases->hasCompatibleRelease();
    }
}
