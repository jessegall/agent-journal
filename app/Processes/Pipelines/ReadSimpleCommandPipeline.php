<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Contracts\CommandReader;
use App\Processes\Pipes\Grammar\FinishSimpleCommand;
use App\Processes\Pipes\Grammar\OpenSimpleCommand;
use App\Processes\Pipes\Grammar\ReadSimpleCommandRedirect;
use App\Processes\Pipes\Grammar\ReadSimpleCommandWord;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\SimpleCommandReading;

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
            OpenSimpleCommand::class,
            Step::repeated(
                Step::chosen(
                    fn (SimpleCommandReading $command) => $command->isAtRedirect(),
                    then: ReadSimpleCommandRedirect::class,
                    else: ReadSimpleCommandWord::class,
                ),
                while: fn (SimpleCommandReading $command) => $command->continues(),
            ),
            FinishSimpleCommand::class,
        ];
    }
}
