<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * Finds code that names a driver's own state: Claude Code's account file and its onboarding and trust fields, and
 * Codex's folder trust. Only the screen navigation passes a driver's screens, so these names belong in the few files
 * that settle an account once, keep tools from reading it, or give Codex the trust its hooks need.
 */
final readonly class DriverStateNames
{
    private const string NAME = '/\.claude\.json|hasCompletedOnboarding|hasTrustDialogAccepted|trust_level/';

    /**
     * Each line of the source that names a driver's own state, as path:line.
     *
     * @return list<string>
     */
    public static function in(string $path, string $source): array
    {
        $found = [];

        foreach (explode("\n", $source) as $index => $line) {
            if (preg_match(self::NAME, $line) === 1) {
                $found[] = $path.':'.($index + 1);
            }
        }

        return $found;
    }
}
