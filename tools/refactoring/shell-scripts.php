<?php

declare(strict_types=1);

/**
 * Reads the project's shell scripts for the two shell checks (docs/shell-scripts.md).
 *
 *   php tools/refactoring/shell-scripts.php names <paths>
 *       prints every function and variable name the scripts declare, as "type<TAB>name<TAB>script", which
 *       name-faults.php judges with every other name of the project.
 *   Both take --except <list> first: the scripts on that list are still to be rewritten and are left out.
 *   php tools/refactoring/shell-scripts.php faults [--except <list>] <paths>
 *       prints each place a script breaks the standard and fails while there is one. A script on the list is still
 *       to be rewritten: its faults are not printed, and it is printed itself once it has none left.
 */
final class ShellScript
{
    private const array SKIPPED_FOLDERS = [
        'vendor',
        'node_modules',
        '.git',
        '.journal',
        'storage',
        'images',
        'testdata',
    ];

    private const string NAME = '[A-Za-z_][A-Za-z0-9_]*';

    private const string STATEMENT_START = '(?:^|[;{(]|&&|\|\||\bthen\b|\bdo\b|\belse\b)\s*';

    private const array OTHER_LANGUAGES = [
        'python3 -c',
        'python -c',
        'php -r',
        'node -e',
        'perl -e',
    ];

    private const array SENTENCE_WORDS = [
        'the',
        'a',
        'an',
        'its',
        'that',
        'which',
    ];

    private const int COMMENT_LINE_LIMIT = 3;

    private const string MAIN_CALL = 'main "$@"';

    /**
     * @param  list<string>  $lines
     */
    private function __construct(public readonly string $path, private readonly array $lines) {}

    /**
     * Every shell script under the paths: a file named .sh or one whose first line names sh or bash.
     *
     * @param  list<string>  $paths
     * @return list<self>
     */
    public static function under(array $paths): array
    {
        $scripts = [];

        foreach ($paths as $path) {
            foreach (self::filesUnder($path) as $file) {
                if (self::isShell($file)) {
                    $scripts[] = new self($file, explode("\n", rtrim((string) file_get_contents($file), "\n")));
                }
            }
        }

        usort($scripts, fn (self $one, self $other): int => $one->path <=> $other->path);

        return $scripts;
    }

    /**
     * @return list<string> each as "type<TAB>name"
     */
    public function names(): array
    {
        $names = [];

        foreach ($this->functions() as $function => $body) {
            $names[] = "function\t{$function}";
        }

        foreach ($this->lines as $line) {
            foreach (self::assignedIn($line) as $variable) {
                $names[] = "variable\t{$variable}";
            }
        }

        return array_values(array_unique($names));
    }

    /**
     * @return list<string> what the script does that the standard does not allow
     */
    public function faults(): array
    {
        return [
            ...$this->shapeFaults(),
            ...$this->commentFaults(),
            ...$this->languageFaults(),
            ...$this->functionFaults(),
        ];
    }

    /**
     * @return list<string>
     */
    private function shapeFaults(): array
    {
        if ($this->isLibrary()) {
            return [];
        }

        $faults = [];

        if (! isset($this->functions()['main'])) {
            $faults[] = 'has no main function';
        }

        if (trim((string) array_last($this->lines)) !== self::MAIN_CALL) {
            $faults[] = 'does not end with '.self::MAIN_CALL;
        }

        return $faults;
    }

    /**
     * @return list<string>
     */
    private function commentFaults(): array
    {
        $faults = [];
        $run = 0;

        foreach ($this->lines as $index => $line) {
            $isComment = $index > 0 && str_starts_with(ltrim($line), '#');
            $run = $isComment ? $run + 1 : 0;

            if ($run === self::COMMENT_LINE_LIMIT + 1) {
                $faults[] = 'line '.($index + 1).': a comment longer than '.self::COMMENT_LINE_LIMIT.' lines';
            }
        }

        return $faults;
    }

    /**
     * @return list<string>
     */
    private function languageFaults(): array
    {
        $faults = [];

        foreach ($this->lines as $index => $line) {
            foreach (self::OTHER_LANGUAGES as $language) {
                if (str_contains($line, $language) && ! str_starts_with(ltrim($line), '#')) {
                    $faults[] = 'line '.($index + 1).": {$language} holds another language; make it a file";
                }
            }
        }

        return $faults;
    }

    /**
     * @return list<string>
     */
    private function functionFaults(): array
    {
        $faults = [];

        foreach ($this->functions() as $function => $body) {
            $words = explode('_', $function);

            if (preg_match('/^[a-z][a-z0-9_]*$/', $function) !== 1 || array_intersect($words, self::SENTENCE_WORDS) !== []) {
                $faults[] = "{$function}: name it verb_noun, in lower case, with no articles";
            }

            if ($function === 'main') {
                continue;
            }

            $local = [];

            foreach ($body as $line) {
                if (preg_match('/^\s*local\s+(.*)$/', $line, $declared) === 1) {
                    preg_match_all('/(?:^|\s)('.self::NAME.')(?==|\s|$)/', $declared[1], $found);
                    $local = [
                        ...$local,
                        ...$found[1],
                    ];

                    continue;
                }

                foreach (array_diff(self::assignedIn($line), $local) as $variable) {
                    $faults[] = "{$function}: sets {$variable}, which is not local; declare it local or set it in main";
                }
            }
        }

        return array_values(array_unique($faults));
    }

    /**
     * Each function with the lines of its body.
     *
     * @return array<string, list<string>>
     */
    private function functions(): array
    {
        $functions = [];
        $current = null;

        foreach ($this->lines as $line) {
            if (preg_match('/^('.self::NAME.')\(\)\s*\{/', $line, $opened) === 1) {
                $current = $opened[1];
                $functions[$current] = [];

                continue;
            }

            if ($line === '}') {
                $current = null;

                continue;
            }

            if ($current !== null) {
                $functions[$current][] = $line;
            }
        }

        return $functions;
    }

    /**
     * The variables a line sets: by assignment, as a loop's variable, or as what read fills.
     *
     * @return list<string>
     */
    private static function assignedIn(string $line): array
    {
        if (str_starts_with(ltrim($line), '#')) {
            return [];
        }

        // Quoted text is words, not code: a "for" in a message names no loop variable.
        $line = (string) preg_replace('/"(?:[^"\\\\]|\\\\.)*"|\'[^\']*\'/', '""', $line);
        $names = [];
        preg_match_all('/'.self::STATEMENT_START.'(?:local\s+|export\s+|readonly\s+)?('.self::NAME.')=/', $line, $assigned);
        preg_match_all('/\bfor\s+('.self::NAME.')\b/', $line, $looped);
        $names = [
            ...$assigned[1],
            ...$looped[1],
        ];

        if (preg_match('/\bread\s+(?:-[a-z]+\s+)*((?:'.self::NAME.'\s*)+);?\s*(?:do)?$/', $line, $read) === 1) {
            $names = [
                ...$names,
                ...preg_split('/\s+/', trim($read[1])) ?: [],
            ];
        }

        return array_values(array_unique(array_diff($names, ['do', 'IFS'])));
    }

    /**
     * A file named .sh, or one whose first line names sh or bash.
     */
    private static function isShell(string $file): bool
    {
        if (str_ends_with($file, '.sh')) {
            return true;
        }

        $opened = fopen($file, 'r');
        $firstLine = $opened === false ? '' : (string) fgets($opened, 128);

        return preg_match('/^#!.*\b(sh|bash)\b/', $firstLine) === 1;
    }

    private function isLibrary(): bool
    {
        return str_contains($this->path, '/lib/');
    }

    /**
     * @return list<string>
     */
    private static function filesUnder(string $path): array
    {
        if (is_file($path)) {
            return [$path];
        }

        if (! is_dir($path)) {
            return [];
        }

        $files = [];

        foreach (scandir($path) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..' || in_array($entry, self::SKIPPED_FOLDERS, true)) {
                continue;
            }

            $files = [
                ...$files,
                ...self::filesUnder("{$path}/{$entry}"),
            ];
        }

        return $files;
    }
}

/**
 * The scripts a list names as still to be rewritten, when the arguments open with --except <list>.
 *
 * @param  list<string>  $arguments
 * @return list<string>
 */
function awaitedScripts(array &$arguments): array
{
    if (($arguments[0] ?? '') !== '--except') {
        return [];
    }

    array_shift($arguments);

    $lines = file((string) array_shift($arguments), FILE_IGNORE_NEW_LINES);

    if ($lines === false) {
        return [];
    }

    return $lines;
}

/**
 * @param  list<string>  $arguments
 */
function listShellNames(array $arguments): int
{
    $awaited = awaitedScripts($arguments);

    foreach (ShellScript::under($arguments) as $script) {
        if (! in_array($script->path, $awaited, true)) {
            foreach ($script->names() as $name) {
                echo "{$name}\t{$script->path}\n";
            }
        }
    }

    return 0;
}

/**
 * @param  list<string>  $arguments
 */
function shellFaults(array $arguments): int
{
    $awaited = awaitedScripts($arguments);
    $found = [];

    foreach (ShellScript::under($arguments) as $script) {
        $faults = $script->faults();
        $isAwaited = in_array($script->path, $awaited, true);

        if ($isAwaited && $faults === []) {
            $found[] = "{$script->path}: follows the standard now; take it off the list of scripts to rewrite";
        }

        if (! $isAwaited) {
            $found = [
                ...$found,
                ...array_map(fn (string $fault): string => "{$script->path}: {$fault}", $faults),
            ];
        }
    }

    echo $found === [] ? '' : implode("\n", $found)."\n";

    if ($found === []) {
        return 0;
    }

    return 1;
}

$arguments = array_slice($argv, 1);
$check = array_shift($arguments);

exit(match ($check) {
    'names' => listShellNames($arguments),
    'faults' => shellFaults($arguments),
    default => 2,
});
