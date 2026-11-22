<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\CommandReader;
use App\Contracts\Bus\PipelineDefinition;
use App\Enums\TokenType;
use App\Pipes\Grammar\ParseFunctionBody;
use App\Pipes\Grammar\SkipNamedFunctionHeader;
use App\Support\Syntax\TokenCursor;

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
