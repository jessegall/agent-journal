<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use Tests\TestCase;

/**
 * The key scripts the server accepts are exactly the ones the host registers, with the same versions and parameter
 * names, so no request names a script its host cannot run.
 */
final class KeyScriptListsTest extends TestCase
{
    /**
     * A KeyScript literal in the host's scripts: its name, version, profile and parameter names.
     */
    private const string HOST_SCRIPT = '/Name:\s*"(\w+)",\s*Version:\s*(\d+),\s*Profile:\s*\w+,\s*'
        .'Parameters:\s*\[\]string\{([^}]*)\}/';

    public function test_the_server_lists_every_script_the_host_registers_and_no_other(): void
    {
        $server = [];

        foreach (config('agents.key_scripts') as $name => $script) {
            $server[$name] = [$script['version'], array_keys($script['parameters'])];
        }

        $this->assertNotSame([], $this->hostScripts());
        $this->assertEqualsCanonicalizing($this->hostScripts(), $server);
    }

    /**
     * Every script the host's Go sources declare, by name, with its version and parameter names.
     *
     * @return array<string, array{int, list<string>}>
     */
    private function hostScripts(): array
    {
        $scripts = [];

        foreach (glob(base_path('tools/journal-agent/keyscripts/scripts/*.go')) ?: [] as $file) {
            if (str_ends_with($file, '_test.go')) {
                continue;
            }
            preg_match_all(self::HOST_SCRIPT, (string) file_get_contents($file), $matches, PREG_SET_ORDER);

            foreach ($matches as [, $name, $version, $parameters]) {
                $names = array_map(fn (string $each) => trim($each, " \"\t\n"), explode(',', $parameters));
                $scripts[$name] = [(int) $version, array_values(array_filter($names))];
            }
        }

        return $scripts;
    }
}
