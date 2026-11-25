<?php

declare(strict_types=1);

/**
 * Lists every command without its own test file. A core command
 * app/Commands/<Subject>/<Name>/<Name>Command.php is tested in tests/Commands/<Subject>/<Name>Test.php; a domain's
 * command domain/<Domain>/src/Commands/<Name>/<Name>Command.php in domain/<Domain>/tests/Commands/<Name>Test.php.
 *
 *   php tools/refactoring/command-test-files.php [<root>]
 *       prints "command<TAB>expected test file" for each missing file, and fails while one is missing.
 */
main($argv[1] ?? dirname(__DIR__, 2));

function main(string $root): void
{
    $missing = [];

    foreach (commandFiles($root) as $command => $testFile) {
        if (! is_file("{$root}/{$testFile}")) {
            $missing[] = "{$command}\t{$testFile}";
        }
    }

    echo implode('', array_map(fn (string $line) => $line."\n", $missing));
    exit($missing === [] ? 0 : 1);
}

/**
 * Each command file, relative to the root, with the test file it must have.
 *
 * @return array<string, string>
 */
function commandFiles(string $root): array
{
    $files = [];

    foreach (glob("{$root}/app/Commands/*/*/*Command.php") ?: [] as $path) {
        [$subject, $name] = array_slice(explode('/', $path), -3, 2);
        $files[relative($root, $path)] = "tests/Commands/{$subject}/{$name}Test.php";
    }

    foreach (glob("{$root}/domain/*/src/Commands/*/*Command.php") ?: [] as $path) {
        $domain = basename(dirname($path, 4));
        $name = basename(dirname($path));
        $files[relative($root, $path)] = "domain/{$domain}/tests/Commands/{$name}Test.php";
    }

    ksort($files);

    return $files;
}

function relative(string $root, string $path): string
{
    return substr($path, strlen($root) + 1);
}
