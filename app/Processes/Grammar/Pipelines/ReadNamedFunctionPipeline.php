<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\CommandReader;
use App\Bus\Contracts\PipelineDefinition;
use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipes\ParseFunctionBody;
use App\Processes\Grammar\Pipes\SkipNamedFunctionHeader;
use App\Processes\Grammar\UnparsedCommand;
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
