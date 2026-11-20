<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Support\ReadGrant;
use App\Agents\Values\Operation;
use App\Bus\Support\CommandAuthorization;
use App\Bus\Support\CommandRegistry;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Tools\JournalReadTool;
use App\Mcp\Tools\JournalTool;
use App\Profiles\Values\StartProfileAuthority;

final readonly class JobPermissionReader
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
            return $this->reads->allows($tool->readRequest());
        }

        if (! $this->actors->hasActor()) {
            return true;
        }

        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return ! $this->actors->actor()->type->isAgent();
        }

        $write = $tool->writeDeclaration();

        return $write->isDefined() && $this->allowsCommand($authority, $write->get());
    }

    public function profileKey(): string
    {
        if ($this->actors->hasActor() && ($authority = $this->actors->authority()) instanceof StartProfileAuthority) {
            return $authority->profile->key->key;
        }

        return DiscoveryProfile::MainAgent->value;
    }

    private function allowsCommand(StartProfileAuthority $authority, Dispatches $write): bool
    {
        $declaration = $this->commands->operationOf($write->command);

        if ($declaration !== null && ! $authority->profile->start->access->decide(
            Operation::journal($declaration->name, $declaration->area, $declaration->accessTypes),
        )->allowed) {
            return false;
        }

        return $this->commands->authorizationOf($write->command)->map(
            fn (CommandAuthorization $authorization): bool => $authority->profile->authorization->grants(
                $authorization->policy,
                $authorization->ability,
            ),
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
}
