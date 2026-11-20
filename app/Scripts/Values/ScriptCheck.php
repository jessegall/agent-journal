<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Profiles\Data\ScriptDiagnostic;
use App\Profiles\Values\CompiledScript;

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
