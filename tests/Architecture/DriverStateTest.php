<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DriverStateNames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A driver's screens are passed by the screen navigation alone, so no code writes a driver's own state to make a
 * screen go away, except the account's first-run step and the few files that protect or trust a driver's folders.
 */
#[TimeLimit(seconds: 20, reason: 'It reads every source file of the project.')]
final class DriverStateTest extends TestCase
{
    private const array FOLDERS = ['app', 'domain', 'tools', 'scripts', '.docker'];

    private const array ALLOWED = [
        // The account's first-run step settles Claude Code's welcome and trust once, beside the navigation.
        'app/Support/Drivers/ClaudeFirstRun.php',
        // The settings that keep file tools from reading the account's own files name them to refuse them.
        'app/Support/Drivers/ClaudeAccountProtection.php',
        // Codex runs the journal's hooks only in a trusted folder: the empty working root the journal made.
        'app/Support/Drivers/CodexFolderTrust.php',
        // The evidence script proves a trusted folder's own settings load, so no work folder is ever trusted.
        'tools/accounts/check-codex.php',
    ];

    public function test_only_the_first_run_step_and_the_folder_settings_name_a_drivers_own_state(): void
    {
        $found = [];

        foreach ($this->sourceFiles() as $path) {
            array_push($found, ...DriverStateNames::in($path, (string) file_get_contents(base_path($path))));
        }

        $this->assertSame([], $found);
    }

    public function test_a_class_that_writes_a_drivers_onboarding_is_caught(): void
    {
        $path = 'tests/Fixtures/DriverState/OnboardingBypass.php';

        $this->assertSame([$path.':17'], DriverStateNames::in($path, (string) file_get_contents(base_path($path))));
    }

    /**
     * @return list<string>
     */
    private function sourceFiles(): array
    {
        $listed = (string) shell_exec('git -C '.escapeshellarg(base_path()).' ls-files '.implode(' ', self::FOLDERS));

        return array_values(array_filter(
            explode("\n", $listed),
            fn (string $path) => $path !== ''
                && ! in_array($path, self::ALLOWED, true)
                && ! str_contains($path, '/testdata/')
                && ! str_ends_with($path, '_test.go'),
        ));
    }
}
