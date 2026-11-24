<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\CommandReader;
use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\AttachRedirectToSimpleCommand;
use App\Pipes\Grammar\AttachWordToSimpleCommand;
use App\Pipes\Grammar\CloseSimpleCommandNode;
use App\Pipes\Grammar\OpenSimpleCommandNode;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Step;
use App\Support\Syntax\TokenCursor;

/**
 * simple := (assignment | word | redirect)+; each word runs through the word pipeline and each redirect through the
 * redirect pipeline. A line of only redirects is still a command, with no program. Any command no other reader takes
 * is a simple command.
 *
 * @implements PipelineDefinition<UnparsedCommand, NodeRead>
 */
final readonly class ReadSimpleCommandPipeline implements CommandReader, PipelineDefinition
{
    public string $input = UnparsedCommand::class;

    public string $output = NodeRead::class;

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
