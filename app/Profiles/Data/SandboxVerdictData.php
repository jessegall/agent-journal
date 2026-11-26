<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Values\SandboxVerdict;
use Spatie\LaravelData\Attributes\Validation\Present;
use Spatie\LaravelData\Data;

/**
 * Whether Claude Code's sandbox ran in one agent image, as a host's isolation probes found it.
 */
final class SandboxVerdictData extends Data
{
    public function __construct(
        public readonly string $image,
        public readonly bool $isRunnable,
        #[Present]
        public readonly string $why,
    ) {}

    public function verdict(): SandboxVerdict
    {
        return $this->isRunnable ? SandboxVerdict::runs() : SandboxVerdict::refused($this->why);
    }
}
