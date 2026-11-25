<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\CommandMiddleware;
use App\Contracts\Bus\Pipe;
use App\Enums\Engine\CommandScopeType;
use App\Exceptions\MiddlewareDeclarationInvalid;
use App\Exceptions\MiddlewareListedTwice;
use App\Support\CommandDeclarations;
use App\Support\CommandOwner;
use App\Support\MiddlewareDeclaration;
use App\Support\ReflectedType;
use App\Support\RegisteredMiddleware;
use App\Support\SharedBindingCheck;

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

                if (! ReflectedType::factory()->isSubclassOf($class, CommandMiddleware::class)) {
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

                SharedBindingCheck::check(
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
     * @param  array<string, CommandOwner>  $owners
     * @param  list<string>  $ownerClasses
     */
    private static function checkScope(
        CommandOwner $owner,
        MiddlewareDeclaration $declaration,
        array $owners,
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

        $commandOwner = $owners[$scope->target] ?? null;

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
