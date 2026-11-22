<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\CommandReader;
use App\Contracts\PipelineDefinition;
use App\Pipes\Grammar\AttachRedirectToSimpleCommand;
use App\Pipes\Grammar\AttachWordToSimpleCommand;
use App\Pipes\Grammar\CloseSimpleCommandNode;
use App\Pipes\Grammar\OpenSimpleCommandNode;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Step;
use App\Support\Syntax\TokenCursor;

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
                Step::chosen(
                    fn (SimpleCommandDraft $command) => $command->isAtRedirect(),
                    then: AttachRedirectToSimpleCommand::class,
                    else: AttachWordToSimpleCommand::class
                ),
                while: fn (SimpleCommandDraft $command) => $command->continues()
            ),
            CloseSimpleCommandNode::class,
        ];
    }
}
