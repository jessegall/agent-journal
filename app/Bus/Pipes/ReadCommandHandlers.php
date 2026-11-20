<?php

declare(strict_types=1);

namespace App\Bus\Pipes;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandHandlerTwice;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Support\Command as BaseCommand;
use App\Bus\Support\CommandDeclarations;
use App\Bus\Support\CommandGrammar;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\DeclaredCommand;
use App\Pipelines\Contracts\Pipe;
use Illuminate\Contracts\Queue\ShouldQueue;
use ReflectionClass;

/**
 * Reads every owner's commands against the command grammar and the handler each names: a command is listed once, is
 * a final readonly command in its owner's Commands folder, repeats no attribute and has one handler no other
 * command has.
 */
final readonly class ReadCommandHandlers implements Pipe
{
    private const array SINGLE_ATTRIBUTES = [
        RepeatableRead::class,
        Effect::class,
        Operation::class,
        RequiresRequestKey::class,
        RetainedActorRequestKey::class,
        Authorize::class,
        Entry::class,
    ];

    public function handle(CommandDeclarations $declarations): CommandDeclarations
    {
        $commands = [];
        $handlers = [];

        foreach ($declarations->owners as $owner) {
            $grammar = $declarations->grammarFor($owner);

            foreach ($owner->commands as $command) {
                $key = strtolower($command);

                if (isset($commands[$key])) {
                    throw CommandListedTwice::for($command);
                }

                $handler = $this->handlerOf($grammar, $owner, $command);

                if (isset($handlers[$handler])) {
                    throw HandlerServesTwoCommands::for($handler);
                }

                $handlers[$handler] = true;
                $commands[$key] = new DeclaredCommand($command, $owner, $handler);
            }
        }

        return $declarations->withCommands(array_values($commands));
    }

    /**
     * Checks one command against the grammar and returns the handler it names.
     *
     * @return class-string
     */
    private function handlerOf(CommandGrammar $grammar, CommandOwner $owner, string $command): string
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

        foreach (self::SINGLE_ATTRIBUTES as $attribute) {
            if (count($reflection->getAttributes($attribute)) > 1) {
                throw CommandDeclarationInvalid::for($command, 'it repeats '.class_basename($attribute));
            }
        }

        $problem = $grammar->problemWithProperties($command);

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
}
