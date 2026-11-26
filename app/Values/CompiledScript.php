<?php

declare(strict_types=1);

namespace App\Values;

use App\Scripts\Values\Instruction;
use App\Scripts\Values\ScriptHandler;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a profile script compiled to: the hash of its source, each trigger's handler, its instructions by id, and the
 * digest of the definitions it was compiled against.
 */
final class CompiledScript extends Data
{
    /**
     * @param  array<string, ScriptHandler>  $handlers  by trigger
     * @param  array<string, Instruction>  $instructions  by id
     */
    public function __construct(
        public readonly string $sourceHash,
        #[DataCollectionOf(ScriptHandler::class)]
        public readonly array $handlers,
        #[DataCollectionOf(Instruction::class)]
        public readonly array $instructions,
        public readonly string $definitionDigest,
    ) {}

    /**
     * What a revision without a script compiles to: no handlers and no instructions.
     */
    public static function none(): self
    {
        return new self('', [], [], '');
    }
}
