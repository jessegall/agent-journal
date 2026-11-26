<?php

declare(strict_types=1);

/**
 * Every name the project declares, read fresh from the code each time so nothing is written down: the PHP code's, the
 * frontend's, the shell scripts', the Go host's and the file names.
 */

require_once __DIR__.'/declared-names.php';

/**
 * Where the project's own code is.
 */
const PROJECT_FOLDERS = [
    'app',
    'domain',
    'resources/js',
    'tests',
    'tools',
    'scripts',
    '.docker',
    'database',
    'config',
    'routes',
];

/**
 * What goReturnsOf answers for a function whose parameters run over several lines.
 */
const GO_RETURNS_UNREAD = '(unread)';

/**
 * What holds no name of the project's own: installed, generated, built or recorded files, and the fixture that holds
 * every naming fault on purpose for the test that proves the scan finds them.
 */
const NOT_PROJECT_NAMES = '#(^|/)(vendor|node_modules|\.build|testdata)/|resources/js/(generated|actions|routes)/'
    .'|tests/Fixtures/Architecture/Names/#';

/**
 * @param  list<string>  $paths
 * @return list<DeclaredName>
 */
function projectNames(array $paths): array
{
    $files = projectFiles($paths);
    $listed = array_filter([...frontendNames($paths), ...shellNames($paths)], fn (DeclaredName $declared) => in_array(
        (string) preg_replace('/:\d+$/', '', $declared->place),
        $files,
        true,
    ));

    return [
        ...declaredNames(array_values(array_filter($files, fn (string $file) => str_ends_with($file, '.php')))),
        ...$listed,
        ...goNames(array_values(array_filter($files, fn (string $file) => str_ends_with($file, '.go')))),
        ...fileNames($files),
    ];
}

/**
 * The files git keeps or would keep under the paths, without what holds no name of the project's own unless a path
 * names it, as the naming test names its fixture.
 *
 * @param  list<string>  $paths
 * @return list<string>
 */
function projectFiles(array $paths): array
{
    $listed = commandLines(['git', 'ls-files', '-co', '--exclude-standard', '--', ...$paths]);
    $named = array_filter($paths, fn (string $path) => preg_match(NOT_PROJECT_NAMES, rtrim($path, '/').'/') === 1);

    return array_values(array_filter($listed, fn (string $file) => is_file($file)
        && (preg_match(NOT_PROJECT_NAMES, $file) !== 1
            || array_any($named, fn (string $path) => $file === $path || str_starts_with($file, rtrim($path, '/').'/')))));
}

/**
 * The frontend's names, as list-frontend-names.ts reads them from the .ts and .vue files under the paths or named.
 *
 * @param  list<string>  $paths
 * @return list<DeclaredName>
 */
function frontendNames(array $paths): array
{
    $sources = array_values(array_filter($paths, fn (string $path) => is_dir($path) || preg_match('/\.(ts|vue)$/', $path) === 1));

    if ($sources === []) {
        return [];
    }

    $lines = commandLines(['node', '--experimental-strip-types', __DIR__.'/list-frontend-names.ts', ...$sources]);

    return array_map(function (string $line): DeclaredName {
        [$declarationType, $name, $place] = explode("\t", $line) + [
            1 => '',
            2 => '',
        ];

        return new DeclaredName($declarationType, $name, $place);
    }, $lines);
}

/**
 * The shell scripts' function and variable names; every function is a step, so an action.
 *
 * @param  list<string>  $paths
 * @return list<DeclaredName>
 */
function shellNames(array $paths): array
{
    $lines = commandLines([PHP_BINARY, __DIR__.'/shell-scripts.php', 'names', ...$paths]);

    return array_map(function (string $line): DeclaredName {
        [$declarationType, $name, $place] = explode("\t", $line) + [
            1 => '',
            2 => '',
        ];

        return new DeclaredName($declarationType, $name, $place, $declarationType === 'function' ? 'action' : 'thing');
    }, $lines);
}

/**
 * The Go host's names: its functions and methods, types, struct fields, constants and variables, each function with
 * its role (goRoleOf).
 *
 * @param  list<string>  $files
 * @return list<DeclaredName>
 */
function goNames(array $files): array
{
    $names = [];

    foreach ($files as $file) {
        $block = null;

        foreach (file($file, FILE_IGNORE_NEW_LINES) ?: [] as $index => $line) {
            $place = "{$file}:".($index + 1);
            $block = goBlockAfter($line, $block);
            $declared = goDeclaration($line, $block, $place);
            array_push($names, ...$declared);
        }
    }

    return $names;
}

/**
 * The block a Go line leaves open: a struct's fields, an interface's methods, or a grouped const or var.
 */
function goBlockAfter(string $line, string|null $block): string|null
{
    return match (true) {
        preg_match('/^type \w+ struct \{$/', $line) === 1 => 'property',
        preg_match('/^type \w+ interface \{$/', $line) === 1 => 'interface',
        preg_match('/^const \($/', $line) === 1 => 'constant',
        preg_match('/^var \($/', $line) === 1 => 'variable',
        $line === '}' || $line === ')' => null,
        default => $block,
    };
}

/**
 * @return list<DeclaredName>
 */
function goDeclaration(string $line, string|null $block, string $place): array
{
    if (preg_match('/^func (\([^)]*\) )?(\w+)(\[[^\]]*\])?\(/', $line, $match, PREG_OFFSET_CAPTURE) === 1) {
        $declarationType = $match[1][0] === '' ? 'function' : 'method';
        $returns = goReturnsOf(substr($line, $match[0][1] + strlen($match[0][0]) - 1));

        return [new DeclaredName($declarationType, $match[2][0], $place, goRoleOf($returns))];
    }

    if (preg_match('/^type (\w+)/', $line, $match) === 1) {
        return [new DeclaredName('type', $match[1], $place)];
    }

    if (preg_match('/^(const|var) (\w+)/', $line, $match) === 1) {
        return [new DeclaredName($match[1] === 'const' ? 'constant' : 'variable', $match[2], $place)];
    }

    if ($block === 'interface' && preg_match('/^\t(\w+)\(/', $line, $match, PREG_OFFSET_CAPTURE) === 1) {
        $returns = goReturnsOf(substr($line, $match[0][1] + strlen($match[0][0]) - 1));

        return [new DeclaredName('method', $match[1][0], $place, goRoleOf($returns), 'interface')];
    }

    if ($block !== null && $block !== 'interface' && preg_match('/^\t(\w+)\s+\S/', $line, $match) === 1 && $match[1] !== 'return') {
        return [new DeclaredName($block, $match[1], $place)];
    }

    if (preg_match('/^\s+((?:\w+\s*,\s*)*\w+)\s*:=/', $line, $match) === 1) {
        $locals = array_filter(array_map(trim(...), explode(',', $match[1])), fn (string $name) => $name !== '_');

        return array_values(array_map(fn (string $name) => new DeclaredName('variable', $name, $place), $locals));
    }

    return [];
}

/**
 * What a Go function returns, read from the text after its parameter list up to its body.
 */
function goReturnsOf(string $fromParameters): string
{
    $depth = 0;

    foreach (str_split($fromParameters) as $at => $character) {
        $depth += match ($character) {
            '(' => 1,
            ')' => -1,
            default => 0,
        };

        if ($depth === 0) {
            return trim((string) preg_replace('/\{.*$/', '', substr($fromParameters, $at + 1)));
        }
    }

    // The parameters go on past this line, so what it returns is not on it.
    return GO_RETURNS_UNREAD;
}

/**
 * A Go function that returns nothing, or only an error, is a command; one that returns a bool a question.
 */
function goRoleOf(string $returns): string
{
    return match ($returns) {
        GO_RETURNS_UNREAD => 'thing',
        '', 'error' => 'action',
        'bool' => 'question',
        default => 'thing',
    };
}

/**
 * The file names, each without its extensions: a PHP or Vue file is left out, since it is named for the class or
 * component it holds, and a shell script is an action.
 *
 * @param  list<string>  $files
 * @return list<DeclaredName>
 */
function fileNames(array $files): array
{
    $named = array_filter($files, fn (string $file) => ! preg_match('/\.(php|vue)$/', $file));

    return array_values(array_map(function (string $file): DeclaredName {
        $name = str_replace(['-', '.'], '_', (string) preg_replace('/\..*$/', '', basename($file)));

        return new DeclaredName('file', $name, $file, str_ends_with($file, '.sh') ? 'action' : 'thing');
    }, $named));
}

/**
 * The lines a command prints, without empty ones; a command that fails stops the scan with what it printed.
 *
 * @param  list<string>  $command
 * @return list<string>
 */
function commandLines(array $command): array
{
    $process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    $output = stream_get_contents($pipes[1]);
    $errors = stream_get_contents($pipes[2]);

    if (proc_close($process) !== 0) {
        fwrite(STDERR, implode(' ', $command)." failed:\n{$errors}");

        exit(2);
    }

    return array_values(array_filter(explode("\n", (string) $output), fn (string $line) => $line !== ''));
}
