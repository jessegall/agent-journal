<?php

declare(strict_types=1);

namespace App\Profiles\Values;

final readonly class CompiledScript
{
    /** @param array<string, mixed> $graph */
    public function __construct(public array $graph, public string $definitionDigest) {}
}
