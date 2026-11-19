<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\TokenType;
use App\Processes\Pipes\Grammar\ParseFunctionBody;
use App\Processes\Pipes\Grammar\SkipNamedFunctionHeader;
use App\Processes\Syntax\TokenCursor;

/**
 * name () body: a function definition, not supported.
 */
final readonly class ReadNamedFunctionPipeline implements CommandReader, PipelineDefinition
{
    public static function reads(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::Word)
            && $cursor->peekIs(1, TokenType::OpenParen)
            && $cursor->peekIs(2, TokenType::CloseParen);
    }

    public function pipes(): array
    {
        return [
            SkipNamedFunctionHeader::class,
            ParseFunctionBody::class,
        ];
    }
}
