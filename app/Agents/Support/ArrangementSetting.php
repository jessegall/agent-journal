<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\ArrangementType;
use App\Agents\Exceptions\ArrangementUnknown;
use App\Agents\Exceptions\HostArrangementRefused;
use App\Agents\Exceptions\InstallationNameMissing;
use App\Agents\Models\Host;

/**
 * The arrangement this journal runs its agents in, read once from AGENTS_ARRANGEMENT; the one place that answers it,
 * so no code reads the setting itself.
 */
final readonly class ArrangementSetting
{
    private function __construct(
        public ArrangementType $arrangement,
        private string $installationName,
    ) {}

    /**
     * @throws ArrangementUnknown
     * @throws InstallationNameMissing
     */
    public static function fromConfig(string $value, string $installationName): self
    {
        $arrangement = ArrangementType::tryFrom($value) ?? throw ArrangementUnknown::for($value);

        if ($arrangement->isContained() && $installationName === '') {
            throw InstallationNameMissing::whenContained();
        }

        return new self($arrangement, $installationName);
    }

    /**
     * The mounts a helper container may have here; contained, the one account folder it may mount is the session's
     * own, when it has an account.
     */
    public function mountRules(string|null $accountSource): MountRules
    {
        return $this->arrangement->isContained()
            ? MountRules::contained($this->installationName, $accountSource)
            : MountRules::local();
    }

    /**
     * @throws HostArrangementRefused
     */
    public function assertFits(Host $host): void
    {
        if ($host->arrangement === $this->arrangement) {
            return;
        }

        throw $this->arrangement->isContained()
            ? HostArrangementRefused::localHost()
            : HostArrangementRefused::containedHost();
    }
}
