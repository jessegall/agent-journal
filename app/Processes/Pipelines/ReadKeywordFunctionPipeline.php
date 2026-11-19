<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\TokenType;
use App\Processes\Pipes\Grammar\ParseFunctionBody;
use App\Processes\Pipes\Grammar\SkipKeywordFunctionHeader;
use App\Processes\Syntax\TokenCursor;

/**
 * function name [()] body: a function definition, not supported.
 */
final readonly class ReadKeywordFunctionPipeline implements CommandReader, PipelineDefinition
{
    public static function reads(TokenCursor $cursor): bool
    {
        return $cursor->currentLiteral() === 'function' && $cursor->peekIs(1, TokenType::Word);
    }

    public function pipes(): array
    {
        return [
            SkipKeywordFunctionHeader::class,
            ParseFunctionBody::class,
        ];
    }
}
