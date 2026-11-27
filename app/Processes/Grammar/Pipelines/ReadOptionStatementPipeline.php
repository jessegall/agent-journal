<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\CommandReader;
use App\Bus\Contracts\PipelineDefinition;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipes\NoteOptionStatement;
use App\Processes\Grammar\Pipes\ParseOptionStatement;
use App\Processes\Grammar\UnparsedCommand;
use App\Support\Syntax\TokenCursor;

/**
 * set, shopt, setopt or unsetopt: read as a simple command and marked not supported, since it changes how the shell
 * reads the lines after it.
 *
 * @implements PipelineDefinition<UnparsedCommand, NodeRead>
 */
final readonly class ReadOptionStatementPipeline implements CommandReader, PipelineDefinition
{
    private const array OPTION_STATEMENTS = [
        'set',
        'shopt',
        'setopt',
        'unsetopt',
    ];

    public string $input = UnparsedCommand::class;

    public string $output = NodeRead::class;

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
