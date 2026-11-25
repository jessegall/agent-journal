<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\ReadGrant;
use App\Attributes\Bus\Dispatches;
use App\Mcp\Contracts\JobPermissionReader as JobPermissionReaderContract;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Tools\JournalReadTool;
use App\Mcp\Tools\JournalTool;
use App\Support\CommandRegistry;
use App\Values\StartProfileAuthority;

final readonly class JobPermissionReader implements JobPermissionReaderContract
{
    public function __construct(
        private CurrentActor $actors,
        private CommandRegistry $commands,
        private ReadGrant $reads,
    ) {}

    public function allows(JournalTool $tool): bool
    {
        if (! $this->isVisible($tool)) {
            return false;
        }

        if ($tool instanceof JournalReadTool) {
            return $this->allowsRead($tool);
        }

        if (! $this->actors->hasActor()) {
            return true;
        }

        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return ! $this->actors->actor()->isAgent();
        }

        $write = $tool->writeDeclaration();

        return $write->isDefined() && $this->allowsCommand($authority, $write->get());
    }

    public function profileKey(): string
    {
        if (! $this->actors->hasActor()) {
            return DiscoveryProfile::MainAgent->value;
        }

        $authority = $this->actors->authority();

        if ($authority instanceof StartProfileAuthority) {
            return $authority->profileKey();
        }

        return DiscoveryProfile::MainAgent->value;
    }

    private function allowsCommand(StartProfileAuthority $authority, Dispatches $write): bool
    {
        $authorize = $this->commands->has($write->command) ? $this->commands->authorizeOf($write->command) : null;

        return $authorize !== null && $authority->admits($write->command, $authorize);
    }

    private function isVisible(JournalTool $tool): bool
    {
        if (! $this->actors->hasActor()) {
            return true;
        }

        $authority = $this->actors->authority();

        return ! $authority instanceof StartProfileAuthority
            || $tool->isVisibleTo(DiscoveryProfile::from($authority->profile->base->key));
    }

    private function allowsRead(JournalReadTool $tool): bool
    {
        return $this->reads->allows($tool->readRequest());
    }
}
