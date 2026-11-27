<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Access\Contracts\ReadGrant;
use App\Actors\Contracts\CurrentActor;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Dispatches;
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
        return $this->actors->startProfileAuthority()->map(
            fn (StartProfileAuthority $authority) => $authority->profileKey(),
        )->getOrElse(DiscoveryProfile::MainAgent->value);
    }

    private function allowsCommand(StartProfileAuthority $authority, Dispatches $write): bool
    {
        return $this->commands->applicationAuthorizeOf($write->command)->map(
            fn (Authorize $authorize) => $authority->admits($write->command, $authorize),
        )->getOrElse(false);
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
        return $this->reads->allows($tool->discoveryRequest());
    }
}
