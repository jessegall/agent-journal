<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\CommandReader;
use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipes\AttachRedirectToSimpleCommand;
use App\Processes\Grammar\Pipes\AttachWordToSimpleCommand;
use App\Processes\Grammar\Pipes\CloseSimpleCommandNode;
use App\Processes\Grammar\Pipes\OpenSimpleCommandNode;
use App\Processes\Grammar\SimpleCommandDraft;
use App\Processes\Grammar\UnparsedCommand;
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
                Step::conditional(
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
