<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\CommandReader;
use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\NoteOptionStatement;
use App\Pipes\Grammar\ParseOptionStatement;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\NodeRead;
use App\Support\Syntax\TokenCursor;

/**
 * set, shopt, setopt or unsetopt: read as a simple command and marked not supported, since it changes how the shell
 * reads the lines after it.
 *
 * @implements PipelineDefinition<UnparsedCommand, NodeRead>
 */
final readonly class ReadOptionStatementPipeline implements CommandReader, PipelineDefinition
{
    public string $input = UnparsedCommand::class;

    public string $output = NodeRead::class;

    private const array OPTION_STATEMENTS = ['set', 'shopt', 'setopt', 'unsetopt'];

    public static function reads(TokenCursor $cursor): bool
    {
        return in_array($cursor->currentLiteral(), self::OPTION_STATEMENTS, true);
    }

    public function pipes(): array
    {
        return [
            NoteOptionStatement::class,
            ParseOptionStatement::class,
        ];
    }
}
