<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Contracts\CommandReader;
use App\Processes\Pipes\Grammar\AttachRedirectToSimpleCommand;
use App\Processes\Pipes\Grammar\AttachWordToSimpleCommand;
use App\Processes\Pipes\Grammar\CloseSimpleCommandNode;
use App\Processes\Pipes\Grammar\OpenSimpleCommandNode;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\SimpleCommandBeingRead;

/**
 * simple := (assignment | word | redirect)+; each word runs through the word pipeline and each redirect through the
 * redirect pipeline. A line of only redirects is still a command, with no program. Any command no other reader takes
 * is a simple command.
 */
final readonly class ReadSimpleCommandPipeline implements CommandReader, PipelineDefinition
{
    public static function reads(TokenCursor $cursor): bool
    {
        return true;
    }

    public function pipes(): array
    {
        return [
            OpenSimpleCommandNode::class,
            Step::repeated(
                Step::chosen(fn (SimpleCommandBeingRead $command) => $command->isAtRedirect(),
                    then: AttachRedirectToSimpleCommand::class,
                    else: AttachWordToSimpleCommand::class
                ),
                while: fn (SimpleCommandBeingRead $command) => $command->continues()
            ),
            CloseSimpleCommandNode::class,
        ];
    }
}
