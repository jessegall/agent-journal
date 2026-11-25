<?php

declare(strict_types=1);

namespace App\Values;

final readonly class CompiledScript
{
    /**
     * @param  array<string, mixed>  $graph
     */
    public function __construct(public array $graph, public string $definitionDigest) {}

    /**
     * What a revision without a script compiles to: a graph with no handlers.
     */
    public static function empty(): self
    {
        return new self(['handlers' => []], '');
    }
}
