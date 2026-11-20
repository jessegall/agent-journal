<?php

declare(strict_types=1);

namespace App\Bus\Pipes;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Enums\CommandScopeType;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use App\Bus\Support\BuiltFresh;
use App\Bus\Support\CommandDeclarations;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\RegisteredMiddleware;
use App\Pipelines\Contracts\Pipe;

/**
 * Checks every middleware declaration: a CommandMiddleware in its owner's CommandMiddleware folder, built fresh,
 * listed once per scope, and scoped to an installed owner or to a command its owner may name.
 */
final readonly class CheckCommandMiddleware implements Pipe
{
    public function handle(CommandDeclarations $declarations): CommandDeclarations
    {
        $registered = [];
        $seen = [];
        $commandOwners = $declarations->commandOwners();
        $ownerClasses = array_map(static fn (CommandOwner $owner) => $owner->domainClass, $declarations->owners);

        foreach ($declarations->owners as $owner) {
            foreach ($owner->middleware as $declaration) {
                $class = $declaration->middleware;
                $key = $declaration->identity();

                if (! class_exists($class) || ! is_subclass_of($class, CommandMiddleware::class)) {
                    throw MiddlewareDeclarationInvalid::for($class, 'it is no class implementing CommandMiddleware');
                }

                if (! $owner->holdsIn('CommandMiddleware', $class)) {
                    throw MiddlewareDeclarationInvalid::for(
                        $class,
                        "it is not in {$owner->name}'s CommandMiddleware folder",
                    );
                }

                if (isset($seen[$key])) {
                    throw MiddlewareListedTwice::for($class);
                }

                BuiltFresh::check(
                    $class,
                    static fn (string $problem) => MiddlewareDeclarationInvalid::for($class, $problem),
                );
                self::checkScope($owner, $declaration, $commandOwners, $ownerClasses);
                $seen[$key] = true;
                $registered[] = new RegisteredMiddleware($owner->name, $declaration);
            }
        }

        return $declarations->withMiddleware($registered);
    }

    /**
     * @param  array<string, CommandOwner>  $commandOwners
     * @param  list<string>  $ownerClasses
     */
    private static function checkScope(
        CommandOwner $owner,
        MiddlewareDeclaration $declaration,
        array $commandOwners,
        array $ownerClasses,
    ): void {
        $scope = $declaration->scope;

        if ($scope->type === CommandScopeType::Owner && ! in_array($scope->target, $ownerClasses, true)) {
            throw MiddlewareDeclarationInvalid::for(
                $declaration->middleware,
                "its scope names {$scope->target}, which is no installed owner",
            );
        }

        if ($scope->type !== CommandScopeType::Command) {
            return;
        }

        $commandOwner = $commandOwners[$scope->target] ?? null;

        if ($commandOwner === null) {
            throw MiddlewareDeclarationInvalid::for(
                $declaration->middleware,
                "its scope names {$scope->target}, which is no registered command",
            );
        }

        $mayName = $commandOwner->exportsCommand($scope->target)
            && ($commandOwner->name === CommandOwner::CORE || $owner->requiresOwner($commandOwner->name));

        if ($commandOwner !== $owner && ! $mayName) {
            throw MiddlewareDeclarationInvalid::for(
                $declaration->middleware,
                "its owner may not name {$scope->target}: it is neither its own nor exported by an owner it requires",
            );
        }
    }
}
