<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class DeviceApprovalDataFields
{
    private string $userCode;

    private string $projectLabel;

    private string $machineLabel;

    /** @var list<string> */
    private array $scopes;

    private string $expiresAt;

    private string $journalOrigin;

    private string $environmentLabel;

    private string $state;

    private bool $isBindingRevoked;

    public function userCode(string $userCode): self
    {
        $this->userCode = $userCode;

        return $this;
    }

    public function projectLabel(string $projectLabel): self
    {
        $this->projectLabel = $projectLabel;

        return $this;
    }

    public function machineLabel(string $machineLabel): self
    {
        $this->machineLabel = $machineLabel;

        return $this;
    }

    /** @param list<string> $scopes */
    public function scopes(array $scopes): self
    {
        $this->scopes = $scopes;

        return $this;
    }

    public function expiresAt(string $expiresAt): self
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }

    public function journalOrigin(string $journalOrigin): self
    {
        $this->journalOrigin = $journalOrigin;

        return $this;
    }

    public function environmentLabel(string $environmentLabel): self
    {
        $this->environmentLabel = $environmentLabel;

        return $this;
    }

    public function state(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function isBindingRevoked(bool $isBindingRevoked): self
    {
        $this->isBindingRevoked = $isBindingRevoked;

        return $this;
    }

    public function finish(): DeviceApprovalData
    {
        if (! isset($this->userCode)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'userCode');
        }

        if (! isset($this->projectLabel)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'projectLabel');
        }

        if (! isset($this->machineLabel)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'machineLabel');
        }

        if (! isset($this->scopes)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'scopes');
        }

        if (! isset($this->expiresAt)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'expiresAt');
        }

        if (! isset($this->journalOrigin)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'journalOrigin');
        }

        if (! isset($this->environmentLabel)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'environmentLabel');
        }

        if (! isset($this->state)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'state');
        }

        if (! isset($this->isBindingRevoked)) {
            throw MissingFields::forType(DeviceApprovalData::class, 'isBindingRevoked');
        }

        return new DeviceApprovalData(
            userCode: $this->userCode,
            projectLabel: $this->projectLabel,
            machineLabel: $this->machineLabel,
            scopes: $this->scopes,
            expiresAt: $this->expiresAt,
            journalOrigin: $this->journalOrigin,
            environmentLabel: $this->environmentLabel,
            state: $this->state,
            isBindingRevoked: $this->isBindingRevoked,
        );
    }
}
