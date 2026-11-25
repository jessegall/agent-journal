<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\CommandReader;
use App\Contracts\Bus\PipelineDefinition;
use App\Enums\CommandRules\TokenType;
use App\Pipes\Grammar\ParseFunctionBody;
use App\Pipes\Grammar\SkipNamedFunctionHeader;
use App\Support\Grammar\NodeRead;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Syntax\TokenCursor;

/**
 * name () body: a function definition, not supported.
 *
 * @implements PipelineDefinition<UnparsedCommand, NodeRead>
 */
final readonly class ReadNamedFunctionPipeline implements CommandReader, PipelineDefinition
{
    public string $input = UnparsedCommand::class;

    public string $output = NodeRead::class;

    public static function reads(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::Word)
            && $cursor->isNext(1, TokenType::OpenParen)
            && $cursor->isNext(2, TokenType::CloseParen);
    }

    public function pipes(): array
    {
        return [
            SkipNamedFunctionHeader::class,
            ParseFunctionBody::class,
        ];
    }
}
