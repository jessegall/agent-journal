<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Projects\Enums\ProjectWindowStatus;
use App\Web\Creation\Exceptions\MissingFields;

final class ProjectWindowDataFields
{
    private ProjectWindowStatus $status;

    private bool $hasProjectLabel = false;

    private string|null $projectLabel;

    private bool $hasMachineLabel = false;

    private string|null $machineLabel;

    private string $connectAddress;

    /** @var list<ProjectTreeEntryData> */
    private array $entries = [];

    public function status(ProjectWindowStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function projectLabel(string|null $projectLabel): self
    {
        $this->projectLabel = $projectLabel;
        $this->hasProjectLabel = true;

        return $this;
    }

    public function machineLabel(string|null $machineLabel): self
    {
        $this->machineLabel = $machineLabel;
        $this->hasMachineLabel = true;

        return $this;
    }

    public function connectAddress(string $connectAddress): self
    {
        $this->connectAddress = $connectAddress;

        return $this;
    }

    /** @param list<ProjectTreeEntryData> $entries */
    public function entries(array $entries): self
    {
        $this->entries = $entries;

        return $this;
    }

    public function finish(): ProjectWindowData
    {
        if (! isset($this->status)) {
            throw MissingFields::forType(ProjectWindowData::class, 'status');
        }

        if (! $this->hasProjectLabel) {
            throw MissingFields::forType(ProjectWindowData::class, 'projectLabel');
        }

        if (! $this->hasMachineLabel) {
            throw MissingFields::forType(ProjectWindowData::class, 'machineLabel');
        }

        if (! isset($this->connectAddress)) {
            throw MissingFields::forType(ProjectWindowData::class, 'connectAddress');
        }

        return new ProjectWindowData(
            status: $this->status,
            projectLabel: $this->projectLabel,
            machineLabel: $this->machineLabel,
            connectAddress: $this->connectAddress,
            entries: $this->entries,
        );
    }
}
