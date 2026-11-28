<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class ConnectProjectWindowDataFields
{
    private string $serverName;

    private string $origin;

    private bool $canIssue;

    /** @var list<string> */
    private array $holdReasons;

    private ReleaseOfferData $release;

    /** @var list<JoinTargetData> */
    private array $projects;

    private InstallAttemptListData $attempts;

    private BindingListData $bindings;

    public function serverName(string $serverName): self
    {
        $this->serverName = $serverName;

        return $this;
    }

    public function origin(string $origin): self
    {
        $this->origin = $origin;

        return $this;
    }

    public function canIssue(bool $canIssue): self
    {
        $this->canIssue = $canIssue;

        return $this;
    }

    /** @param list<string> $holdReasons */
    public function holdReasons(array $reasons): self
    {
        $this->holdReasons = $reasons;

        return $this;
    }

    public function release(ReleaseOfferData $release): self
    {
        $this->release = $release;

        return $this;
    }

    /** @param list<JoinTargetData> $projects */
    public function projects(array $projects): self
    {
        $this->projects = $projects;

        return $this;
    }

    public function attempts(InstallAttemptListData $attempts): self
    {
        $this->attempts = $attempts;

        return $this;
    }

    public function bindings(BindingListData $bindings): self
    {
        $this->bindings = $bindings;

        return $this;
    }

    public function finish(): ConnectProjectWindowData
    {
        if (! isset($this->serverName)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'serverName');
        }

        if (! isset($this->origin)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'origin');
        }

        if (! isset($this->canIssue)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'canIssue');
        }

        if (! isset($this->holdReasons)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'holdReasons');
        }

        if (! isset($this->release)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'release');
        }

        if (! isset($this->projects)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'projects');
        }

        if (! isset($this->attempts)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'attempts');
        }

        if (! isset($this->bindings)) {
            throw MissingFields::forType(ConnectProjectWindowData::class, 'bindings');
        }

        return new ConnectProjectWindowData(
            serverName: $this->serverName,
            origin: $this->origin,
            canIssue: $this->canIssue,
            holdReasons: $this->holdReasons,
            release: $this->release,
            projects: $this->projects,
            attempts: $this->attempts,
            bindings: $this->bindings,
        );
    }
}
