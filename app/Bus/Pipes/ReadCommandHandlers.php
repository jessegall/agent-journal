<?php

declare(strict_types=1);

namespace App\Bus\Pipes;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Support\Command as BaseCommand;
use App\Bus\Support\CommandDeclarations;
use App\Bus\Support\CommandGrammar;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\DeclaredCommand;
use App\Pipelines\Contracts\Pipe;
use App\Reflection\Support\Reflector;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Reads every owner's commands against the command grammar and finds each one's handler by its name: a command is
 * listed once, is a final readonly command in its owner's Commands folder, repeats no attribute and has a handler of
 * its own name in the owner's Handlers folder.
 */
final readonly class ReadCommandHandlers implements Pipe
{
    private const array SINGLE_ATTRIBUTES = [
        RepeatableRead::class,
        Effect::class,
        RequiresRequestKey::class,
        RetainedActorRequestKey::class,
        Authorize::class,
        Entry::class,
    ];

    public function handle(CommandDeclarations $declarations): CommandDeclarations
    {
        $commands = [];

        foreach ($declarations->owners as $owner) {
            $grammar = $declarations->grammarFor($owner);

            foreach ($owner->commands as $command) {
                $key = strtolower($command);

                if (isset($commands[$key])) {
                    throw CommandListedTwice::for($command);
                }

                $handler = $this->handlerOf($grammar, $owner, $command);
                $commands[$key] = DeclaredCommand::read($command, $owner, $handler);
            }
        }

        return $declarations->withCommands(array_values($commands));
    }

    /**
     * Checks one command against the grammar and returns its handler.
     *
     * @return class-string
     */
    private function handlerOf(CommandGrammar $grammar, CommandOwner $owner, string $command): string
    {
        if (! $owner->holdsIn('Commands', $command)) {
            throw CommandDeclarationInvalid::for($command, "it is not in {$owner->name}'s Commands folder");
        }

        if (! Reflector::exists($command) || ! Reflector::of($command)->isSubclassOf(Command::class)) {
            throw CommandDeclarationInvalid::for($command, 'it is no class implementing Command');
        }

        $declaration = Reflector::of($command);

        if (! $declaration->isFinal() || ! $declaration->isReadOnly()) {
            throw CommandDeclarationInvalid::for($command, 'a command is a final readonly class');
        }

        if (! $declaration->isSubclassOf(BaseCommand::class)) {
            throw CommandDeclarationInvalid::for($command, 'a command extends App\\Bus\\Support\\Command');
        }

        if ($declaration->implements(ShouldQueue::class)) {
            throw CommandDeclarationInvalid::for(
                $command,
                'queueing a command is not supported yet; take ShouldQueue off',
            );
        }

        foreach (self::SINGLE_ATTRIBUTES as $attribute) {
            if (count($declaration->attributes($attribute)) > 1) {
                throw CommandDeclarationInvalid::for($command, 'it repeats '.class_basename($attribute));
            }
        }

        $problem = $grammar->problemWithProperties($command);

        if ($problem !== null) {
            throw CommandDeclarationInvalid::for($command, $problem);
        }

        $handler = self::handlerNamedFor($command);

        if (! Reflector::exists($handler)) {
            throw CommandHandlerMissing::for($command, $handler);
        }

        return $handler;
    }

    /**
     * The handler a command has by its name: App\X\Commands\Foo is handled by App\X\Handlers\FooHandler.
     */
    private static function handlerNamedFor(string $command): string
    {
        $folder = (int) strrpos($command, '\\Commands\\');

        return substr($command, 0, $folder).'\\Handlers\\'.substr($command, $folder + strlen('\\Commands\\')).'Handler';
    }
}
