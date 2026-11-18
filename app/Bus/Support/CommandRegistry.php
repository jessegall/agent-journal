<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\AllowsEngine;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Enums\CommandScopeType;
use App\Bus\Enums\MiddlewareStage;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandHandlerTwice;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;
use Illuminate\Contracts\Queue\ShouldQueue;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * Every registered command with its handler, owner and middleware, checked once at start-up so a wrong declaration
 * stops the application before any command runs (doc 19, section 6.1). It holds class names and values only.
 */
final readonly class CommandRegistry
{
    /**
     * @param  array<class-string, RegisteredCommand>  $commands
     */
    private function __construct(private array $commands) {}

    /**
     * Checks every owner's commands, handlers and middleware and refuses the first wrong declaration.
     *
     * @param  list<CommandOwner>  $owners  Core first, then the domains in bootstrap/domains.php order
     */
    public static function from(array $owners): self
    {
        $commands = [];
        $handlers = [];

        foreach ($owners as $owner) {
            foreach ($owner->commands as $command) {
                $key = strtolower($command);

                if (isset($commands[$key])) {
                    throw CommandListedTwice::for($command);
                }

                $handler = self::checkedCommand($owner, $owners, $command);

                if (isset($handlers[$handler])) {
                    throw HandlerServesTwoCommands::for($handler);
                }

                self::checkHandler($owner, $owners, $command, $handler);

                $handlers[$handler] = true;
                $commands[$key] = [$command, $owner, $handler];
            }
        }

        self::checkExportedCommandsAreRegistered($owners);
        $middleware = self::checkedMiddleware($owners, array_column($commands, 1, 0));
        $registered = [];

        foreach ($commands as [$command, $owner, $handler]) {
            $reflection = new ReflectionClass($command);
            $registered[$command] = new RegisteredCommand(
                handler: $handler,
                owner: $owner->name,
                exported: $owner->exportsCommand($command),
                repeatableRead: $reflection->getAttributes(RepeatableRead::class) !== [],
                actor: self::requiredActorOf($reflection),
                allowsEngine: $reflection->getAttributes(AllowsEngine::class) !== [],
                middleware: self::orderedFor($command, $owner, $middleware, $owners),
            );
        }

        return new self($registered);
    }

    /**
     * Every command an owner exports is one it registers itself.
     *
     * @param  list<CommandOwner>  $owners
     */
    private static function checkExportedCommandsAreRegistered(array $owners): void
    {
        foreach ($owners as $owner) {
            $registered = array_map(strtolower(...), $owner->commands);

            foreach ($owner->exports->commands as $exported) {
                if (! in_array(strtolower($exported), $registered, true)) {
                    throw CommandDeclarationInvalid::exportedButNotRegistered($owner->name, $exported);
                }
            }
        }
    }

    public function has(string $command): bool
    {
        return isset($this->commands[$command]);
    }

    /**
     * Each command with its handler, as Laravel's dispatcher maps them.
     *
     * @return array<class-string, class-string>
     */
    public function handlerMap(): array
    {
        return array_map(fn (RegisteredCommand $entry) => $entry->handler, $this->commands);
    }

    /**
     * @return class-string
     */
    public function handlerOf(string $command): string
    {
        return $this->entry($command)->handler;
    }

    public function ownerOf(string $command): string
    {
        return $this->entry($command)->owner;
    }

    public function isExported(string $command): bool
    {
        return $this->entry($command)->exported;
    }

    public function needsRepeatableRead(string $command): bool
    {
        return $this->entry($command)->repeatableRead;
    }

    public function requiredActor(string $command): ActorType|null
    {
        return $this->entry($command)->actor;
    }

    public function allowsEngine(string $command): bool
    {
        return $this->entry($command)->allowsEngine;
    }

    /**
     * The module middleware a command passes, in order: by stage, then owner order, then declaration order.
     *
     * @return list<RegisteredMiddleware>
     */
    public function middlewareFor(string $command): array
    {
        return $this->entry($command)->middleware;
    }

    private function entry(string $command): RegisteredCommand
    {
        return $this->commands[$command];
    }

    /**
     * The actor type a command's RequiresActor names, or null when any actor may run it.
     *
     * @param  ReflectionClass<*>  $command
     */
    private static function requiredActorOf(ReflectionClass $command): ActorType|null
    {
        $attribute = $command->getAttributes(RequiresActor::class)[0] ?? null;

        return $attribute === null ? null : $attribute->newInstance()->type;
    }

    /**
     * Checks one command against the grammar and returns the handler it names, which the caller checks next.
     *
     * @param  list<CommandOwner>  $owners
     * @return class-string
     */
    private static function checkedCommand(CommandOwner $owner, array $owners, string $command): string
    {
        if (! $owner->holdsIn('Commands', $command)) {
            throw CommandDeclarationInvalid::for($command, "it is not in {$owner->name}'s Commands folder");
        }

        if (! class_exists($command) || ! is_subclass_of($command, Command::class)) {
            throw CommandDeclarationInvalid::for($command, 'it is no class implementing Command');
        }

        $reflection = new ReflectionClass($command);

        if (! $reflection->isFinal() || ! $reflection->isReadOnly()) {
            throw CommandDeclarationInvalid::for($command, 'a command is a final readonly class');
        }

        if ($reflection->implementsInterface(ShouldQueue::class)) {
            throw CommandDeclarationInvalid::for($command, 'queueing a command is not supported yet; take ShouldQueue off');
        }

        foreach ([RepeatableRead::class, RequiresActor::class, AllowsEngine::class] as $attribute) {
            if (count($reflection->getAttributes($attribute)) > 1) {
                throw CommandDeclarationInvalid::for($command, 'it repeats '.class_basename($attribute));
            }
        }

        $requiredActor = self::requiredActorOf($reflection);

        if ($reflection->getAttributes(AllowsEngine::class) !== [] && $requiredActor !== null && $requiredActor !== ActorType::Engine) {
            throw CommandDeclarationInvalid::engineWithOtherActor($command, $requiredActor->value);
        }

        $problem = self::grammarFor($owner, $owners)->problemWithProperties($command);

        if ($problem !== null) {
            throw CommandDeclarationInvalid::for($command, $problem);
        }

        $handledBy = $reflection->getAttributes(HandledBy::class);

        if ($handledBy === []) {
            throw CommandHandlerMissing::for($command);
        }

        if (count($handledBy) > 1) {
            throw CommandHandlerTwice::for($command);
        }

        return $handledBy[0]->newInstance()->handler;
    }

    /**
     * @param  list<CommandOwner>  $owners
     */
    private static function checkHandler(CommandOwner $owner, array $owners, string $command, string $handler): void
    {
        if (! $owner->holdsIn('Handlers', $handler)) {
            throw HandlerInOtherOwner::for($command, $handler);
        }

        if (! class_exists($handler)) {
            throw CommandDeclarationInvalid::for($handler, 'the handler class does not exist');
        }

        $reflection = new ReflectionClass($handler);

        if (! $reflection->isFinal() || ! $reflection->isInstantiable()) {
            throw CommandDeclarationInvalid::for($handler, 'a handler is a final class that can be built');
        }

        self::checkLifetime($handler, static fn (string $problem) => CommandDeclarationInvalid::for($handler, $problem));
        $handle = $reflection->hasMethod('handle') ? $reflection->getMethod('handle') : null;

        if ($handle === null || ! $handle->isPublic() || $handle->isStatic()) {
            throw CommandDeclarationInvalid::for($handler, 'it needs a public, non-static handle method');
        }

        if (! self::takesOnly($handle, $command)) {
            throw CommandDeclarationInvalid::for($handler, "handle takes exactly one required parameter, typed {$command}");
        }

        $problem = self::grammarFor($owner, $owners)->problemWithResult($handle->getReturnType());

        if ($problem !== null) {
            throw CommandDeclarationInvalid::for($handler, "its result {$problem}");
        }
    }

    private static function takesOnly(ReflectionMethod $handle, string $command): bool
    {
        $parameter = $handle->getParameters()[0] ?? null;
        $type = $parameter?->getType();

        return $handle->getNumberOfRequiredParameters() === 1 && $type instanceof ReflectionNamedType && $type->getName() === $command;
    }

    /**
     * Handlers and middleware are built fresh for each command, so none may be kept between requests.
     *
     * @param  class-string  $class
     * @param  callable(string): \RuntimeException  $refusal
     */
    private static function checkLifetime(string $class, callable $refusal): void
    {
        $reflection = new ReflectionClass($class);

        if ($reflection->getAttributes(Singleton::class) !== [] || $reflection->getAttributes(Scoped::class) !== [] || Container::getInstance()->isShared($class)) {
            throw $refusal('it is kept between commands (Singleton, Scoped or shared); it is built fresh for each one');
        }
    }

    /**
     * @param  list<CommandOwner>  $owners
     */
    private static function grammarFor(CommandOwner $owner, array $owners): CommandGrammar
    {
        return new CommandGrammar(static fn (string $class): bool => str_starts_with($class, $owner->namespace.'\\')
            || array_filter($owners, static fn (CommandOwner $other): bool => ($other->name === CommandOwner::CORE || $owner->requiresOwner($other->name)) && $other->exportsClass($class)) !== []);
    }

    /**
     * Checks every middleware declaration and returns them with their declaring owners.
     *
     * @param  list<CommandOwner>  $owners
     * @param  array<string, CommandOwner>  $commandOwners  each command's owner by class name
     * @return list<RegisteredMiddleware>
     */
    private static function checkedMiddleware(array $owners, array $commandOwners): array
    {
        $registered = [];
        $seen = [];
        $ownerClasses = array_map(static fn (CommandOwner $owner) => $owner->domainClass, $owners);

        foreach ($owners as $owner) {
            foreach ($owner->middleware as $declaration) {
                $class = $declaration->middleware;
                $key = "{$class}|{$declaration->scope->type->value}|{$declaration->scope->target}";

                if (! class_exists($class) || ! is_subclass_of($class, CommandMiddleware::class)) {
                    throw MiddlewareDeclarationInvalid::for($class, 'it is no class implementing CommandMiddleware');
                }

                if (! $owner->holdsIn('CommandMiddleware', $class)) {
                    throw MiddlewareDeclarationInvalid::for($class, "it is not in {$owner->name}'s CommandMiddleware folder");
                }

                if (isset($seen[$key])) {
                    throw MiddlewareListedTwice::for($class);
                }

                self::checkLifetime($class, static fn (string $problem) => MiddlewareDeclarationInvalid::for($class, $problem));
                self::checkScope($owner, $declaration, $commandOwners, $ownerClasses);
                $seen[$key] = true;
                $registered[] = new RegisteredMiddleware($owner->name, $declaration);
            }
        }

        return $registered;
    }

    /**
     * @param  array<string, CommandOwner>  $commandOwners
     * @param  list<string>  $ownerClasses
     */
    private static function checkScope(CommandOwner $owner, MiddlewareDeclaration $declaration, array $commandOwners, array $ownerClasses): void
    {
        $scope = $declaration->scope;

        if ($scope->type === CommandScopeType::Owner && ! in_array($scope->target, $ownerClasses, true)) {
            throw MiddlewareDeclarationInvalid::for($declaration->middleware, "its scope names {$scope->target}, which is no installed owner");
        }

        if ($scope->type !== CommandScopeType::Command) {
            return;
        }

        $commandOwner = $commandOwners[$scope->target] ?? null;

        if ($commandOwner === null) {
            throw MiddlewareDeclarationInvalid::for($declaration->middleware, "its scope names {$scope->target}, which is no registered command");
        }

        $mayName = $commandOwner->exportsCommand($scope->target) && ($commandOwner->name === CommandOwner::CORE || $owner->requiresOwner($commandOwner->name));

        if ($commandOwner !== $owner && ! $mayName) {
            throw MiddlewareDeclarationInvalid::for($declaration->middleware, "its owner may not name {$scope->target}: it is neither its own nor exported by an owner it requires");
        }
    }

    /**
     * @param  list<RegisteredMiddleware>  $middleware
     * @param  list<CommandOwner>  $owners
     * @return list<RegisteredMiddleware>
     */
    private static function orderedFor(string $command, CommandOwner $owner, array $middleware, array $owners): array
    {
        $order = array_flip(array_map(static fn (CommandOwner $one) => $one->name, $owners));
        $applying = array_values(array_filter($middleware, static fn (RegisteredMiddleware $entry) => $entry->appliesTo($command, $owner->domainClass)));
        $position = array_flip(array_keys($applying));

        // Stage first, then the owner's place, then the declaration's place, as one whole number to sort by.
        $rank = static fn (RegisteredMiddleware $entry) => ($entry->runsIn(MiddlewareStage::BeforeTransaction) ? 0 : 1_000_000_000) + $order[$entry->owner] * 100_000 + $position[array_search($entry, $applying, true)];
        usort($applying, static fn (RegisteredMiddleware $one, RegisteredMiddleware $other) => $rank($one) <=> $rank($other));

        return $applying;
    }
}
