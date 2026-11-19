<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Contracts\CommandReader;
use App\Processes\Pipes\Grammar\NoteOptionStatement;
use App\Processes\Pipes\Grammar\ParseOptionStatement;
use App\Processes\Syntax\TokenCursor;

/**
 * set, shopt, setopt or unsetopt: read as a simple command and marked not supported, since it changes how the shell
 * reads the lines after it.
 */
final readonly class ReadOptionStatementPipeline implements CommandReader, PipelineDefinition
{
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
