<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Values\ExecutableBinding;
use App\Processes\Values\ExecutableVerdict;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ProgramIdentity;

/**
 * Verifies that the executable a command names is the one its binding trusts (doc 21 revision 3, section 52), from the
 * trusted execution context alone: it never runs which, a shell or the program. A path the agent wrote is taken as
 * written; a bare name resolves through the context's program resolution. A matching base name alone never passes.
 */
final readonly class ExecutableCheck
{
    public function verify(
        ProgramIdentity $program,
        ExecutableBinding $binding,
        ExecutionContext $context,
    ): ExecutableVerdict {
        $resolved = $this->resolvedPath($program, $context);

        if ($resolved === '') {
            return new ExecutableVerdict(
                false,
                $program,
                '',
                "The trusted context does not say where {$program->family} resolves to.",
            );
        }

        if ($binding->trustsContent()) {
            return $this->verifyContent($program, $binding, $context, $resolved);
        }

        if (! in_array(dirname($resolved), $binding->locations, true)) {
            return new ExecutableVerdict(
                false,
                $program,
                $resolved,
                "{$program->family} resolves to {$resolved}, outside its trusted install folders.",
            );
        }

        return new ExecutableVerdict(
            true,
            $program,
            $resolved,
            "{$program->family} resolves to its trusted install at {$resolved}.",
        );
    }

    private function verifyContent(
        ProgramIdentity $program,
        ExecutableBinding $binding,
        ExecutionContext $context,
        string $resolved,
    ): ExecutableVerdict {
        $root = rtrim($context->projectRoot, '/').'/';
        $relative = str_starts_with($resolved, $root) ? substr($resolved, strlen($root)) : $resolved;

        if (! in_array($relative, $binding->locations, true)) {
            return new ExecutableVerdict(
                false,
                $program,
                $resolved,
                "{$program->family} resolves to {$resolved}, not the approved project tool.",
            );
        }

        $digest = is_file($resolved) ? hash_file('sha256', $resolved) : false;

        if ($digest !== $binding->contentDigest) {
            return new ExecutableVerdict(
                false,
                $program,
                $resolved,
                "The content of {$resolved} differs from the approved revision.",
            );
        }

        return new ExecutableVerdict(true, $program, $resolved, "{$resolved} matches the approved project tool.");
    }

    /**
     * The absolute path the command would execute: the written path, or the context's resolution of a bare name.
     */
    private function resolvedPath(ProgramIdentity $program, ExecutionContext $context): string
    {
        if (str_contains($program->original, '/')) {
            return str_starts_with($program->original, '/') ? $program->original : rtrim(
                $context->workingFolder,
                '/',
            ).'/'.preg_replace(
                '#^(\./)+#',
                '',
                $program->original,
            );
        }

        return $context->programs[$program->original] ?? '';
    }
}
