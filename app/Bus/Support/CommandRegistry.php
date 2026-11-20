<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Contracts\Policy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\DeclaresClassLevelAbilities;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Enums\CommandEntry;
use App\Bus\Enums\CommandScopeType;
use App\Bus\Enums\MiddlewareStage;
use App\Bus\Exceptions\CommandAuthorizationInvalid;
use App\Bus\Exceptions\CommandAuthorizationMissing;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandHandlerTwice;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use App\Bus\Support\Command as BaseCommand;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;
use Illuminate\Contracts\Queue\ShouldQueue;
use PhpOption\Option;
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
    public static function from(array $owners, PropertyRules $propertyRules): self
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
                effect: self::effectDeclaredBy($reflection),
                requiresRequestKey: self::requiresKey($reflection),
                actorScopedReceipt: $reflection->getAttributes(RetainedActorRequestKey::class) !== [],
                retention: self::declaredRetentionOf($reflection),
                middleware: self::orderedFor($command, $owner, $middleware, $owners),
                rules: $propertyRules->of($reflection),
                authorization: self::authorizationDeclaredBy($reflection),
                entry: self::entryDeclaredBy($reflection),
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

    /**
     * The policy and ability the command declared; none while it declares no Authorize yet.
     *
     * @return Option<CommandAuthorization>
     */
    public function authorizationOf(string $command): Option
    {
        return Option::fromValue($this->entry($command)->authorization);
    }

    /**
     * The entry the command belongs to; an application command unless it declares a trusted one.
     */
    public function entryOf(string $command): CommandEntry
    {
        return $this->entry($command)->entry;
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

    public function effectOf(string $command): CommandEffectType
    {
        return $this->entry($command)->effect;
    }

    public function requiresRequestKey(string $command): bool
    {
        return $this->entry($command)->requiresRequestKey;
    }

    public function retentionOf(string $command): ReceiptRetention
    {
        return $this->entry($command)->retention;
    }

    /**
     * Whether the command keeps its receipts for the actor across sessions, rather than for one session.
     */
    public function hasActorScopedReceipt(string $command): bool
    {
        return $this->entry($command)->actorScopedReceipt;
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

    /**
     * The Laravel rules of each ruled property, the type rule first; empty when the command declares none.
     *
     * @return array<string, list<string|object>>
     */
    public function rulesFor(string $command): array
    {
        return $this->entry($command)->rules;
    }

    private function entry(string $command): RegisteredCommand
    {
        return $this->commands[$command];
    }

    /**
     * The retention a command's RequiresRequestKey declares, or the standard one.
     *
     * @param  ReflectionClass<*>  $command
     */
    private static function declaredRetentionOf(ReflectionClass $command): ReceiptRetention
    {
        $attribute = $command->getAttributes(RequiresRequestKey::class)[0] ?? null;
        $retained = $command->getAttributes(RetainedActorRequestKey::class)[0] ?? null;

        if ($attribute !== null && $retained !== null) {
            $both = 'it declares both RequiresRequestKey and RetainedActorRequestKey';

            throw CommandDeclarationInvalid::for($command->getName(), $both);
        }

        if ($retained !== null) {
            return ReceiptRetention::retainedForActor($command->getName(), $retained->newInstance());
        }

        return $attribute === null
            ? ReceiptRetention::standard()
            : ReceiptRetention::declaredBy($command->getName(), $attribute->newInstance());
    }

    /**
     * Whether every call of the command must carry a request key: one that keeps its receipt, or its actor's.
     *
     * @param  ReflectionClass<object>  $command
     */
    private static function requiresKey(ReflectionClass $command): bool
    {
        return $command->getAttributes(RequiresRequestKey::class) !== []
            || $command->getAttributes(RetainedActorRequestKey::class) !== [];
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

        if (! $reflection->isSubclassOf(BaseCommand::class)) {
            throw CommandDeclarationInvalid::for($command, 'a command extends App\\Bus\\Support\\Command');
        }

        if ($reflection->implementsInterface(ShouldQueue::class)) {
            throw CommandDeclarationInvalid::for(
                $command,
                'queueing a command is not supported yet; take ShouldQueue off',
            );
        }

        $attributes = [
            RepeatableRead::class,
            Effect::class,
            RequiresRequestKey::class,
            RetainedActorRequestKey::class,
            Authorize::class,
            Entry::class,
        ];

        foreach ($attributes as $attribute) {
            if (count($reflection->getAttributes($attribute)) > 1) {
                throw CommandDeclarationInvalid::for($command, 'it repeats '.class_basename($attribute));
            }
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
     * @param  class-string  $command
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

        self::checkLifetime(
            $handler,
            static fn (string $problem) => CommandDeclarationInvalid::for($handler, $problem),
        );
        $handle = $reflection->hasMethod('handle') ? $reflection->getMethod('handle') : null;

        if ($handle === null || ! $handle->isPublic() || $handle->isStatic()) {
            throw CommandDeclarationInvalid::for($handler, 'it needs a public, non-static handle method');
        }

        $declaration = new ReflectionClass($command);
        $authorization = self::authorizationDeclaredBy($declaration);

        if ($authorization === null && ! self::takesOnly($handle, $command)) {
            throw CommandDeclarationInvalid::for(
                $handler,
                "handle takes exactly one required parameter, typed {$command}",
            );
        }

        if ($authorization !== null) {
            self::checkAuthorization($command, $authorization, $handler, $handle);
        }

        $problem = self::grammarFor($owner, $owners)->problemWithResult($handle->getReturnType());

        if ($problem !== null) {
            throw CommandDeclarationInvalid::for($handler, "its result {$problem}");
        }

        if ($authorization === null && self::entryDeclaredBy($declaration) === CommandEntry::Application) {
            throw CommandAuthorizationMissing::for($command);
        }
    }

    /**
     * The trusted entry the command declares; a command without Entry is an application command.
     *
     * @param  ReflectionClass<object>  $command
     */
    private static function entryDeclaredBy(ReflectionClass $command): CommandEntry
    {
        foreach ($command->getAttributes(Entry::class) as $declared) {
            return $declared->newInstance()->entry;
        }

        return CommandEntry::Application;
    }

    /**
     * @param  ReflectionClass<object>  $command
     */
    private static function effectDeclaredBy(ReflectionClass $command): CommandEffectType
    {
        foreach ($command->getAttributes(Effect::class) as $declared) {
            return $declared->newInstance()->type;
        }

        return CommandEffectType::StateChange;
    }

    /**
     * @param  ReflectionClass<object>  $command
     */
    private static function authorizationDeclaredBy(ReflectionClass $command): CommandAuthorization|null
    {
        $declared = $command->getAttributes(Authorize::class)[0] ?? null;

        if ($declared === null) {
            return null;
        }

        $authorize = $declared->newInstance();

        return new CommandAuthorization($authorize->policy, $authorize->ability);
    }

    /**
     * The command, its policy, its subject and its handler must fit together: the subject's type is what the policy's
     * authorize takes, the ability is a case of its enum, a class subject pairs only with a class-level ability, and
     * the handler takes the command and the subject.
     *
     * @param  class-string  $command
     * @param  class-string  $handler
     *
     * @throws CommandAuthorizationInvalid
     */
    private static function checkAuthorization(
        string $command,
        CommandAuthorization $authorization,
        string $handler,
        ReflectionMethod $handle,
    ): void {
        if (! is_subclass_of($command, HasAuthorizationSubject::class)) {
            throw CommandAuthorizationInvalid::subjectMissing($command);
        }

        $policy = $authorization->policy;
        $authorize = is_subclass_of($policy, Policy::class) && method_exists($policy, 'authorize')
            ? new ReflectionMethod($policy, 'authorize')
            : null;
        $parameters = $authorize?->getParameters() ?? [];

        if ($authorize === null || ! $authorize->isPublic() || count($parameters) !== 3) {
            throw CommandAuthorizationInvalid::policyInvalid($command, $policy);
        }

        $subject = (string) new ReflectionMethod($command, 'subject')->getReturnType();
        $accepted = (string) $parameters[1]->getType();

        if (! self::typeFits($subject, $accepted)) {
            throw CommandAuthorizationInvalid::subjectMismatched($command, $subject, $accepted);
        }

        $abilityType = (string) $parameters[2]->getType();
        $ability = $authorization->ability;

        if (! $ability instanceof $abilityType) {
            throw CommandAuthorizationInvalid::abilityMismatched($command, $ability::class, $abilityType);
        }

        $classLevel = $ability instanceof DeclaresClassLevelAbilities && $ability->isClassLevel();

        if ($subject === 'string' && ! $classLevel) {
            throw CommandAuthorizationInvalid::classSubjectOnInstanceAbility($command, $ability::class);
        }

        $classSubjectFits = $subject === 'string' && self::takesOnly($handle, $command);

        if ($classSubjectFits) {
            return;
        }

        $second = $handle->getParameters()[1] ?? null;
        $takesBoth = $handle->getNumberOfRequiredParameters() === 2 && self::takesFirst($handle, $command);

        if (! $takesBoth || $second === null || ! self::typeFits($subject, (string) $second->getType())) {
            throw CommandAuthorizationInvalid::handlerShape($command, $handler, $subject);
        }
    }

    /**
     * Whether a value of the given type is accepted by a parameter of the other, a union or a parent included.
     */
    private static function typeFits(string $given, string $accepted): bool
    {
        foreach (explode('|', $accepted) as $type) {
            $anyObject = $type === 'object' && class_exists($given);

            if ($type === $given || $anyObject || (class_exists($given) && is_a($given, $type, true))) {
                return true;
            }
        }

        return false;
    }

    private static function takesFirst(ReflectionMethod $handle, string $command): bool
    {
        $type = ($handle->getParameters()[0] ?? null)?->getType();

        return $type instanceof ReflectionNamedType && $type->getName() === $command;
    }

    private static function takesOnly(ReflectionMethod $handle, string $command): bool
    {
        $parameter = $handle->getParameters()[0] ?? null;
        $type = $parameter?->getType();

        return $handle->getNumberOfRequiredParameters() === 1
            && $type instanceof ReflectionNamedType
            && $type->getName() === $command;
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

        if ($reflection->getAttributes(Singleton::class) !== []
            || $reflection->getAttributes(Scoped::class) !== []
            || Container::getInstance()->isShared($class)) {
            throw $refusal('it is kept between commands (Singleton, Scoped or shared); it is built fresh for each one');
        }
    }

    /**
     * @param  list<CommandOwner>  $owners
     */
    private static function grammarFor(CommandOwner $owner, array $owners): CommandGrammar
    {
        $exportsTo = static fn (CommandOwner $other, string $class): bool => $other->exportsClass($class)
            && ($other->name === CommandOwner::CORE || $owner->requiresOwner($other->name));

        return new CommandGrammar(static fn (string $class): bool => str_starts_with($class, $owner->namespace.'\\')
            || array_filter($owners, static fn (CommandOwner $other): bool => $exportsTo($other, $class)) !== []);
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
                    throw MiddlewareDeclarationInvalid::for(
                        $class,
                        "it is not in {$owner->name}'s CommandMiddleware folder",
                    );
                }

                if (isset($seen[$key])) {
                    throw MiddlewareListedTwice::for($class);
                }

                self::checkLifetime(
                    $class,
                    static fn (string $problem) => MiddlewareDeclarationInvalid::for($class, $problem),
                );
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

    /**
     * @param  list<RegisteredMiddleware>  $middleware
     * @param  list<CommandOwner>  $owners
     * @return list<RegisteredMiddleware>
     */
    private static function orderedFor(string $command, CommandOwner $owner, array $middleware, array $owners): array
    {
        $order = array_flip(array_map(static fn (CommandOwner $one) => $one->name, $owners));
        $applying = array_values(array_filter(
            $middleware,
            static fn (RegisteredMiddleware $entry) => $entry->appliesTo($command, $owner->domainClass),
        ));
        $position = array_flip(array_keys($applying));

        // Stage first, then the owner's place, then the declaration's place, as one whole number to sort by.
        $rank = static fn (RegisteredMiddleware $entry) => (
            $entry->runsIn(MiddlewareStage::BeforeTransaction) ? 0 : 1_000_000_000
        )
            + $order[$entry->owner] * 100_000
            + $position[array_search($entry, $applying, true)];
        usort(
            $applying,
            static fn (RegisteredMiddleware $one, RegisteredMiddleware $other) => $rank($one) <=> $rank($other),
        );

        return $applying;
    }
}
