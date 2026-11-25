<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Engine\CommandScopeType;
use App\Enums\Engine\MiddlewareStage;

/**
 * A middleware as the registry ordered it for one command, with the owner that declared it.
 */
final readonly class RegisteredMiddleware
{
    public function __construct(
        public string $owner,
        public MiddlewareDeclaration $declaration,
    ) {}

    /**
     * @return class-string
     */
    public function middlewareClass(): string
    {
        return $this->declaration->middleware;
    }

    public function runsIn(MiddlewareStage $stage): bool
    {
        return $this->declaration->stage === $stage;
    }

    /**
     * Whether it acts on the command, given the Domain class of the command's owner.
     */
    public function appliesTo(string $command, string $ownerDomainClass): bool
    {
        $scope = $this->declaration->scope;

        return match ($scope->type) {
            CommandScopeType::All => true,
            CommandScopeType::Command => $scope->target === $command,
            CommandScopeType::Owner => $scope->target === $ownerDomainClass,
        };
    }
}
