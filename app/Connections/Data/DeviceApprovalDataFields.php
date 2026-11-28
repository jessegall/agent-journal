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

    public function userCode(string $code): self
    {
        $this->userCode = $code;

        return $this;
    }

    public function projectLabel(string $label): self
    {
        $this->projectLabel = $label;

        return $this;
    }

    public function machineLabel(string $label): self
    {
        $this->machineLabel = $label;

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

    public function journalOrigin(string $origin): self
    {
        $this->journalOrigin = $origin;

        return $this;
    }

    public function environmentLabel(string $label): self
    {
        $this->environmentLabel = $label;

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
