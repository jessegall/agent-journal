<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Settings\SettingsResolver;
use App\Enums\InstallLineHold;

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
        return $this->holds() === [];
    }

    /**
     * Everything that keeps this server from issuing install lines now; none when it may.
     *
     * @return list<InstallLineHold>
     */
    public function holds(): array
    {
        return array_values(array_filter([
            $this->settings->boolean($this->core->remoteProjects) ? null : InstallLineHold::SwitchedOff,
            $this->origin->isUsable() ? null : InstallLineHold::OriginNotHttps,
            $this->releases->hasCompatibleRelease() ? null : InstallLineHold::NoRelease,
        ]));
    }
}
