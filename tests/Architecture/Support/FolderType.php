<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Bus\Contracts\CommandMiddleware as CommandMiddlewareContract;
use App\Bus\Support\Command;
use App\Hooks\States\AgentState;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use ReflectionClass;
use Throwable;

/**
 * A folder that holds one type of class at its root, and what a class must be to sit there. Anything that helps that
 * type without being of it goes in the folder's Support subfolder.
 */
enum FolderType: string
{
    case States = 'States';
    case Resolvers = 'Resolvers';
    case Actions = 'Actions';
    case Enums = 'Enums';
    case Models = 'Models';
    case Contracts = 'Contracts';
    case Exceptions = 'Exceptions';
    case Listeners = 'Listeners';
    case Providers = 'Providers';
    case Commands = 'Commands';
    case Handlers = 'Handlers';
    case CommandMiddleware = 'CommandMiddleware';

    public static function ofFolder(string $folder): self|null
    {
        return self::tryFrom(basename($folder));
    }

    /**
     * What the class is not, when it does not belong at this folder's root; null when it belongs.
     *
     * @param  ReflectionClass<object>  $class
     */
    public function requirementNotMetBy(ReflectionClass $class): string|null
    {
        $fits = match ($this) {
            self::States => $class->getName() === AgentState::class || $class->isSubclassOf(AgentState::class),
            self::Resolvers => ! $class->isInterface() && array_any($class->getInterfaceNames(), fn (string $name) => str_contains($name, '\\Contracts\\')),
            self::Actions => $class->isFinal() && ! $class->isEnum() && ! $class->isSubclassOf(Throwable::class) && ! $class->isSubclassOf(Model::class),
            self::Enums => $class->isEnum(),
            self::Models => $class->isSubclassOf(Model::class),
            self::Contracts => $class->isInterface(),
            self::Exceptions => $class->isSubclassOf(Throwable::class),
            self::Listeners => $class->hasMethod('handle'),
            self::Providers => $class->isSubclassOf(ServiceProvider::class),
            self::Commands => $class->isFinal() && $class->isReadOnly()
                && $class->isSubclassOf(Command::class),
            self::Handlers => $class->isFinal() && $class->hasMethod('handle') && $class->getMethod('handle')->isPublic(),
            self::CommandMiddleware => $class->implementsInterface(CommandMiddlewareContract::class),
        };

        return $fits ? null : $this->requirement();
    }

    private function requirement(): string
    {
        return match ($this) {
            self::States => 'a state (it extends AgentState)',
            self::Resolvers => 'a resolver (it implements a contract)',
            self::Actions => 'an action (a final class that is no enum, exception or model)',
            self::Enums => 'an enum',
            self::Models => 'a model (it extends Eloquent Model)',
            self::Contracts => 'an interface',
            self::Exceptions => 'an exception',
            self::Listeners => 'a listener (it has a handle method)',
            self::Providers => 'a service provider',
            self::Commands => 'a command (a final readonly class extending App\Bus\Support\Command)',
            self::Handlers => 'a handler (a final class with a public handle method)',
            self::CommandMiddleware => 'a command middleware (it implements CommandMiddleware)',
        };
    }
}
