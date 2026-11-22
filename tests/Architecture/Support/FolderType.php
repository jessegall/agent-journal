<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\CommandMiddleware as CommandMiddlewareContract;
use App\Support\Command;
use App\Support\Reflector;
use App\Support\States\AgentState;
use Illuminate\Console\Command as ArtisanCommand;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
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
    case CommandPair = 'CommandPair';
    case ArtisanCommands = 'ArtisanCommands';

    /**
     * The type a file's place asks for. A command and its handler share a folder named for them under Commands, so
     * Commands/CreateTask holds CreateTaskCommand and CreateTaskHandler and nothing else at its root; a file loose in
     * Commands itself belongs to no pair. A Commands folder under Console holds Artisan adapters.
     */
    public static function ofFile(string $file): self|null
    {
        $folder = dirname($file);
        $name = basename($file, '.php');

        if (basename($folder) === 'Commands' && basename(dirname($folder)) === 'Console') {
            return self::ArtisanCommands;
        }

        if (basename(dirname($folder)) === 'Console') {
            return null;
        }

        if (basename($folder) === 'Commands') {
            return self::CommandPair;
        }

        if (basename(dirname($folder)) === 'Commands' && ! in_array(basename($folder), ['Support', 'Concerns'], true)) {
            return match ($name) {
                basename($folder).'Command' => self::Commands,
                basename($folder).'Handler' => self::Handlers,
                default => self::CommandPair,
            };
        }

        $type = self::tryFrom(basename($folder));

        return in_array($type, [self::Commands, self::Handlers, self::CommandPair], true) ? null : $type;
    }

    /**
     * What the class is not, when it does not belong at this folder's root; null when it belongs.
     *
     * @param  Reflector<object>  $class
     */
    public function requirementNotMetBy(Reflector $class): string|null
    {
        $meetsFolderRequirement = match ($this) {
            self::States => $class->is(AgentState::class),
            self::Resolvers => ! $class->isInterface() && array_any(
                $class->interfaces(),
                fn (Reflector $interface) => str_contains($interface->name(), '\\Contracts\\'),
            ),
            self::Actions => $class->isFinal() && ! $class->isEnum() && ! $class->isSubclassOf(
                Throwable::class,
            ) && ! $class->isSubclassOf(Model::class),
            self::Enums => $class->isEnum(),
            self::Models => $class->isSubclassOf(Model::class),
            self::Contracts => $class->isInterface(),
            self::Exceptions => $class->isSubclassOf(Throwable::class),
            self::Listeners => $class->hasMethod('handle'),
            self::Providers => $class->isSubclassOf(ServiceProvider::class),
            self::Commands => $class->isFinal() && $class->isReadOnly()
                && $class->isSubclassOf(Command::class),
            self::Handlers => $class->isFinal()
                && $class->hasMethod('handle')
                && $class->method('handle')->isPublic(),
            self::CommandMiddleware => $class->implements(CommandMiddlewareContract::class),
            self::CommandPair => false,
            self::ArtisanCommands => $class->isSubclassOf(ArtisanCommand::class) || ! str_ends_with($class->name(), 'Command'),
        };

        return $meetsFolderRequirement ? null : $this->requirement();
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
            self::Commands => 'a command (a final readonly class extending App\Support\Command)',
            self::Handlers => 'a handler (a final class with a public handle method)',
            self::CommandMiddleware => 'a command middleware (it implements CommandMiddleware)',
            self::ArtisanCommands => 'an Artisan command (it extends Illuminate\Console\Command)',
            self::CommandPair => 'a command or its handler named for its folder (Commands/<Name>/<Name>Command or <Name>Handler)',
        };
    }
}
