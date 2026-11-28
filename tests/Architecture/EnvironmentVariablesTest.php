<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\TestCase;

/**
 * Every variable the setup writes (.env.example and scripts/local-host.sh) is read by something: the journal's config,
 * compose.yaml, the frontend, the Go programs or a script. A variable written and read by nothing, such as the address
 * a session container reaches the journal at once the host stopped reading it, fails here.
 */
final class EnvironmentVariablesTest extends TestCase
{
    // Variables Docker Compose reads itself, not through compose.yaml.
    private const array COMPOSE_OWN = ['COMPOSE_PROFILES', 'COMPOSE_PROJECT_NAME'];

    public function test_every_variable_the_setup_writes_is_read(): void
    {
        $unread = array_values(array_diff($this->written(), $this->read(), self::COMPOSE_OWN));

        $this->assertSame([], $unread, 'Written by the setup and read by nothing: '.implode(', ', $unread));
    }

    /**
     * @return list<string>
     */
    private function written(): array
    {
        return array_values(array_unique([
            ...$this->groupsFound('/^([A-Z][A-Z0-9_]*)=/m', ['.env.example']),
            ...$this->groupsFound('/set_setting ([A-Z][A-Z0-9_]*)/', ['scripts/local-host.sh']),
        ]));
    }

    /**
     * @return list<string>
     */
    private function read(): array
    {
        return array_values(array_unique([
            ...$this->groupsFound("/env\\('([A-Z0-9_]+)'/", ['config/*.php', 'vendor/laravel/framework/config/*.php']),
            ...$this->groupsFound('/\$\{([A-Z][A-Z0-9_]*)/', ['compose.yaml']),
            ...$this->groupsFound('/(VITE_[A-Z0-9_]+)/', ['resources/js/**/*.ts', 'domain/*/resources/js/**/*.ts']),
            ...$this->groupsFound('/Getenv\("([A-Z0-9_]+)"\)/', ['programs/**/*.go']),
            ...$this->groupsFound('/\$\{?([A-Z][A-Z0-9_]*)/', ['scripts/**/*.sh', '.docker/**/*.sh']),
        ]));
    }

    /**
     * The first group of each match of the pattern in the files the globs name, under the project.
     *
     * @param  list<string>  $globs
     * @return list<string>
     */
    private function groupsFound(string $pattern, array $globs): array
    {
        $found = [];

        foreach ($globs as $glob) {
            foreach ($this->filesOf($glob) as $file) {
                preg_match_all($pattern, (string) file_get_contents($file), $matches);
                $found = [...$found, ...$matches[1]];
            }
        }

        return $found;
    }

    /**
     * @return list<string>
     */
    private function filesOf(string $glob): array
    {
        if (! str_contains($glob, '**')) {
            return glob(base_path($glob)) ?: [];
        }

        [$root, $name] = explode('/**/', $glob);
        $files = [];

        foreach (glob(base_path($root), GLOB_ONLYDIR) ?: [] as $folder) {
            $tree = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($folder, \FilesystemIterator::SKIP_DOTS));

            foreach ($tree as $file) {
                if (fnmatch($name, $file->getFilename())) {
                    $files[] = $file->getPathname();
                }
            }
        }

        return $files;
    }
}
