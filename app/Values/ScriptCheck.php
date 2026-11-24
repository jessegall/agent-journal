<?php

declare(strict_types=1);

namespace App\Values;

use App\Data\Profiles\ScriptDiagnostic;

final readonly class ScriptCheck
{
    /**
     * @param  list<ScriptDiagnostic>  $diagnostics
     * @param  list<ScriptRange>  $tokens
     */
    public function __construct(
        public array $diagnostics,
        public array $tokens,
        public CompiledScript|null $compiled,
        public string $sourceHash,
        public string $catalogueDigest,
    ) {}
}
