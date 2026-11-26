<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Setup\Contracts\SignInEnvironment;

/**
 * Codex reads its account from the folder as its CODEX_HOME and HOME.
 */
final readonly class CodexSignInEnvironment implements SignInEnvironment
{
    public function __invoke(string $directory): array
    {
        return [
            'PATH' => (string) getenv('PATH'),
            'HOME' => $directory,
            'CODEX_HOME' => $directory,
        ];
    }
}
