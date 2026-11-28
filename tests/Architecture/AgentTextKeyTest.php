<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Support\Str;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every text the journal puts in an agent's context is registered beforehand: each key the code asks for is in a
 * language file, each registered key is asked for somewhere, and a key is always written out, never built.
 */
#[TimeLimit(seconds: 20, reason: 'It reads every PHP file of app and the domains.')]
final class AgentTextKeyTest extends TestCase
{
    private const string USE = '/(?:AgentText::of\(\s*|Decision::deny\(\s*(?=[\'"]))([^\s,)]+)/';

    public function test_every_key_asked_for_is_registered(): void
    {
        $this->assertSame([], array_values(array_diff($this->usedKeys(), $this->registeredKeys())));
    }

    public function test_every_registered_key_is_asked_for(): void
    {
        $this->assertSame([], array_values(array_diff($this->registeredKeys(), $this->usedKeys())));
    }

    public function test_a_key_is_written_out_where_it_is_asked_for(): void
    {
        $built = [];

        foreach ($this->sourceFiles() as $path) {
            preg_match_all(self::USE, (string) file_get_contents(base_path($path)), $calls);

            foreach ($calls[1] as $argument) {
                if (preg_match("/^'[a-z_]+(\.[a-z_]+)+'$/", $argument) !== 1) {
                    $built[] = "{$path}: {$argument}";
                }
            }
        }

        $this->assertSame([], $built);
    }

    /**
     * @return list<string>
     */
    private function registeredKeys(): array
    {
        $keys = $this->flattened('core', require base_path('lang/en/agent.php'));

        foreach (glob(base_path('domain/*/lang/en/agent.php')) ?: [] as $file) {
            $owner = Str::snake(basename(dirname($file, 3)));
            array_push($keys, ...$this->flattened($owner, require $file));
        }

        sort($keys);

        return $keys;
    }

    /**
     * @param  array<string, mixed>  $texts
     * @return list<string>
     */
    private function flattened(string $prefix, array $texts): array
    {
        $keys = [];

        foreach ($texts as $name => $text) {
            if (is_array($text)) {
                array_push($keys, ...$this->flattened("{$prefix}.{$name}", $text));

                continue;
            }

            $keys[] = "{$prefix}.{$name}";
        }

        return $keys;
    }

    /**
     * @return list<string>
     */
    private function usedKeys(): array
    {
        $keys = [];

        foreach ($this->sourceFiles() as $path) {
            preg_match_all(self::USE, (string) file_get_contents(base_path($path)), $calls);

            foreach ($calls[1] as $argument) {
                $keys[] = trim($argument, "'");
            }
        }

        $keys = array_values(array_unique($keys));
        sort($keys);

        return $keys;
    }

    /**
     * @return list<string>
     */
    private function sourceFiles(): array
    {
        $command = 'git -C '.escapeshellarg(base_path()).' ls-files --cached --others --exclude-standard app domain';
        $listed = (string) shell_exec($command);

        return array_values(array_filter(
            explode("\n", $listed),
            fn (string $path) => str_ends_with($path, '.php')
                && ! str_contains($path, '/tests/')
                && ! str_contains($path, '/lang/'),
        ));
    }
}
