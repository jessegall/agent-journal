<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Attributes\RequiresRequestKey;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Command;
use App\Contracts\Pipe;
use App\Exceptions\CommandDeclarationInvalid;
use App\Exceptions\CommandHandlerMissing;
use App\Exceptions\CommandListedTwice;
use App\Exceptions\CommandOperationListedTwice;
use App\Support\Command as BaseCommand;
use App\Support\CommandDeclarations;
use App\Support\CommandGrammar;
use App\Support\CommandName;
use App\Support\CommandOwner;
use App\Support\DeclaredCommand;
use App\Support\Reflector;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Str;

/**
 * Reads every owner's commands against the command grammar and finds each one's handler by its name: a command is
 * listed once, is a final readonly command in its owner's Commands folder, repeats no attribute and has a handler of
 * its own name beside it, in the command's own folder.
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
        $operations = [];

        foreach ($declarations->owners as $owner) {
            $grammar = $declarations->grammarFor($owner);

            foreach ($owner->commands as $command) {
                $key = strtolower($command);

                if (isset($commands[$key])) {
                    throw CommandListedTwice::for($command);
                }

                // One owner's operation keys stay unique across both layouts, as receipts and logs name commands by it.
                $operationName = CommandName::of($command);
                $operation = $owner->name.':'.strtolower($operationName);

                if (isset($operations[$operation])) {
                    throw CommandOperationListedTwice::for(
                        $owner->name,
                        $operationName,
                        $operations[$operation],
                        $command,
                    );
                }

                $operations[$operation] = $command;

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

        if (! str_ends_with($command, 'Command')) {
            throw CommandDeclarationInvalid::for($command, 'its name does not end in Command');
        }

        if (! Reflector::factory()->isSubclassOf($command, Command::class)) {
            throw CommandDeclarationInvalid::for($command, 'it is no class implementing Command');
        }

        $declaration = Reflector::of($command);

        if (! $declaration->isFinal() || ! $declaration->isReadOnly()) {
            throw CommandDeclarationInvalid::for($command, 'a command is a final readonly class');
        }

        if (! $declaration->isSubclassOf(BaseCommand::class)) {
            throw CommandDeclarationInvalid::for($command, 'a command extends App\\Support\\Command');
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
     * The handler a command has beside it in its own folder: App\X\Commands\Foo\FooCommand is handled by
     * App\X\Commands\Foo\FooHandler.
     */
    private static function handlerNamedFor(string $command): string
    {
        return Str::beforeLast($command, 'Command').'Handler';
    }
}
