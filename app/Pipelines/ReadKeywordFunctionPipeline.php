<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\CommandReader;
use App\Contracts\Bus\PipelineDefinition;
use App\Enums\TokenType;
use App\Pipes\Grammar\ParseFunctionBody;
use App\Pipes\Grammar\SkipKeywordFunctionHeader;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\NodeRead;
use App\Support\Syntax\TokenCursor;

/**
 * function name [()] body: a function definition, not supported.
 *
 * @implements PipelineDefinition<CommandToParse, NodeRead>
 */
final readonly class ReadKeywordFunctionPipeline implements CommandReader, PipelineDefinition
{
    public string $input = CommandToParse::class;

    public string $output = NodeRead::class;

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
