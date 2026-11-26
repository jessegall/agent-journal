<?php

declare(strict_types=1);

/**
 * Renames every name that holds one word to hold another, narrowed to a kind of name, a namespace or a folder, through
 * the syntax tree renamers, each loading its language once for the whole list: move.php for PHP types (each reference
 * and its file), rename-member.php for PHP members, parameters and variables, rename-go.php (gopls) for Go, and
 * rename-frontend.cjs (the TypeScript service with Vue's plugin) for .ts and .vue. Shell names are renamed by hand.
 * Without --apply it only prints the renames, so they can be read first.
 */

require_once __DIR__.'/project-names.php';

/**
 * @param  list<string>  $arguments  <word> <replacement> [--type=class,method] [--namespace=App\Pipes] [--path=app] [--apply]
 */
function renameNames(array $arguments): int
{
    $options = renameOptions($arguments);
    $files = projectFiles($options['paths']);
    $phpFiles = array_values(array_filter($files, fn (string $file) => str_ends_with($file, '.php')));
    $goFiles = array_values(array_filter($files, fn (string $file) => str_ends_with($file, '.go')));
    $chosen = array_filter(declaredNames($phpFiles), fn (DeclaredName $declared) => isChosen($declared, $options));
    $goChosen = array_values(array_filter(goNames($goFiles), fn (DeclaredName $declared) => isChosen($declared, $options)));
    $frontendChosen = array_values(array_filter(
        frontendNames($options['paths']),
        fn (DeclaredName $declared) => in_array(preg_replace('/:\d+$/', '', $declared->place), $files, true) && isChosen($declared, $options),
    ));
    $typeLines = [];
    $memberLines = [];

    foreach ($goChosen as $declared) {
        echo "go {$declared->place} {$declared->name} ".replacedWord($declared->name, $options)."\n";
    }

    foreach ($frontendChosen as $declared) {
        echo 'frontend '.frontendRenameLine($declared, $options)."\n";
    }

    foreach ($chosen as $declared) {
        $line = renameLine($declared, $options);
        $declared->owner !== '' && in_array($declared->declarationType, ['class', 'interface', 'trait', 'enum'], true)
            ? $typeLines[] = $line
            : $memberLines[] = $line;
    }

    echo implode("\n", [...$typeLines, ...$memberLines])."\n";

    if (! $options['apply']) {
        return 0;
    }

    return max(
        applyRenames(array_values(array_unique($typeLines)), array_values(array_unique($memberLines))),
        applyGoRenames($goChosen, $options),
        applyFrontendRenames($frontendChosen, $options),
    );
}

/**
 * Hands every Go rename to rename-go.php at once, which asks gopls for them all on one load of the module.
 *
 * @param  list<DeclaredName>  $names
 * @param  array{word: string, replacement: string, verb: bool}  $options
 */
function applyGoRenames(array $names, array $options): int
{
    if ($names === []) {
        return 0;
    }

    $module = 'tools/journal-agent/';
    $lines = [];

    foreach ($names as $declared) {
        [$file, $line] = explode(':', $declared->place);
        $column = strpos((string) (file($file, FILE_IGNORE_NEW_LINES)[(int) $line - 1] ?? ''), $declared->name);
        $lines[] = substr($file, strlen($module)).":{$line}:".((int) $column + 1).' '.replacedWord($declared->name, $options);
    }

    $list = (string) tempnam(sys_get_temp_dir(), 'go-renames');
    file_put_contents($list, implode("\n", $lines)."\n");
    passthru(escapeshellarg(PHP_BINARY).' '.escapeshellarg(__DIR__.'/rename-go.php').' --list='.escapeshellarg($list), $code);
    unlink($list);

    return $code;
}

/**
 * @param  list<string>  $arguments
 * @return array{word: string, replacement: string, types: list<string>, namespace: string, paths: list<string>, apply: bool}
 */
function renameOptions(array $arguments): array
{
    $options = [
        'word' => '', 'replacement' => '', 'types' => [], 'namespace' => '', 'paths' => [], 'apply' => false, 'verb' => false,
    ];
    $words = [];

    foreach ($arguments as $argument) {
        match (true) {
            str_starts_with($argument, '--type=') => $options['types'] = explode(',', substr($argument, 7)),
            str_starts_with($argument, '--namespace=') => $options['namespace'] = ltrim(substr($argument, 12), '\\'),
            str_starts_with($argument, '--path=') => $options['paths'][] = substr($argument, 7),
            $argument === '--apply' => $options['apply'] = true,
            $argument === '--verb' => $options['verb'] = true,
            default => $words[] = $argument,
        };
    }

    [$options['word'], $options['replacement']] = array_map(strtolower(...), $words + [
        '',
        '',
    ]);
    $options['paths'] = $options['paths'] ?: PROJECT_FOLDERS;

    return $options;
}

/**
 * Whether a name holds the word, or with --verb is an action (a method or function that returns nothing, or an
 * action class) that starts with it, where an action keeps its verb.
 *
 * @param  array{word: string, types: list<string>, namespace: string, verb: bool}  $options
 */
function isChosen(DeclaredName $declared, array $options): bool
{
    $words = wordsOf($declared->name);
    $isAction = $declared->role === 'action';
    $holdsWord = $options['verb']
        ? $isAction && ($words[0] ?? '') === $options['word']
        : holdsPhrase($words, explode(' ', $options['word']));
    $isType = $options['types'] === [] || in_array($declared->declarationType, $options['types'], true);
    $isInNamespace = $options['namespace'] === '' || str_starts_with($declared->owner, $options['namespace'].'\\');

    return $holdsWord && $isType && $isInNamespace;
}

/**
 * The renamer's line for one name: "Owner NewName" for a type, "<kind> <owner or file> old new" for the rest.
 *
 * @param  array{word: string, replacement: string, verb: bool}  $options
 */
function renameLine(DeclaredName $declared, array $options): string
{
    $own = ltrim((string) preg_replace('/^.*::|\(\)$/', '', $declared->name), '$');
    $renamed = replacedWord($own, $options);
    $file = (string) preg_replace('/:\d+$/', '', $declared->place);

    return match ($declared->declarationType) {
        'class', 'interface', 'trait', 'enum' => "{$declared->owner} {$renamed}",
        'parameter', 'variable' => "variable {$file} {$own} {$renamed}",
        'case' => "constant {$declared->owner} {$own} {$renamed}",
        default => "{$declared->declarationType} {$declared->owner} {$own} {$renamed}",
    };
}

/**
 * The identifier with each whole word equal to the word replaced, or with --verb only its first, in the spelling of
 * the word it replaces (report, Report or REPORT).
 *
 * @param  array{word: string, replacement: string, verb: bool}  $options
 */
function replacedWord(string $identifier, array $options): string
{
    preg_match_all('/[A-Z]+(?![a-z])|[A-Z]?[a-z0-9]+|[^A-Za-z0-9]+/', $identifier, $segments);
    $segments = $segments[0];
    $phrase = explode(' ', $options['word']);
    $replacement = explode(' ', $options['replacement']);
    $replaced = [];

    for ($at = 0; $at < count($segments); $at++) {
        $run = phraseRunAt($segments, $at, $phrase);

        if ($run === [] || ($options['verb'] && $at !== 0)) {
            $replaced[] = $segments[$at];

            continue;
        }

        $replaced[] = spelledLike($segments, $run, $replacement);
        $at = end($run);
    }

    return implode('', $replaced);
}

/**
 * Whether the words of a name hold the phrase's words one after another.
 *
 * @param  list<string>  $words
 * @param  list<string>  $phrase
 */
function holdsPhrase(array $words, array $phrase): bool
{
    for ($at = 0; $at + count($phrase) <= count($words); $at++) {
        if (array_slice($words, $at, count($phrase)) === $phrase) {
            return true;
        }
    }

    return false;
}

/**
 * The places of the segments that spell the phrase from a segment on, word segments with at most one separator
 * between two of them, or none when the phrase does not start there.
 *
 * @param  list<string>  $segments
 * @param  list<string>  $phrase
 * @return list<int>
 */
function phraseRunAt(array $segments, int $at, array $phrase): array
{
    $run = [];

    foreach ($phrase as $index => $word) {
        if ($index > 0 && preg_match('/^[^A-Za-z0-9]$/', $segments[$at] ?? '') === 1) {
            $at++;
        }

        if (strtolower($segments[$at] ?? '') !== $word) {
            return [];
        }

        $run[] = $at;
        $at++;
    }

    return $run;
}

/**
 * The replacement's words written the way the matched segments were: REPORT_NAME, ReportName, reportName or
 * report_name.
 *
 * @param  list<string>  $segments
 * @param  list<int>  $run
 * @param  list<string>  $replacement
 */
function spelledLike(array $segments, array $run, array $replacement): string
{
    $first = $segments[$run[0]];
    $separator = count($run) > 1 && $run[1] - $run[0] === 2 ? $segments[$run[0] + 1] : '';
    $isUpper = $first === strtoupper($first) && ctype_alpha($first) && strlen($first) > 1;
    $words = [];

    foreach ($replacement as $index => $word) {
        $words[] = match (true) {
            $isUpper => strtoupper($word),
            $separator === '' && ($index > 0 || ctype_upper($first[0])) => ucfirst($word),
            $index === 0 && ctype_upper($first[0]) => ucfirst($word),
            default => $word,
        };
    }

    if ($separator === '' && count($run) === 1 && count($replacement) > 1 && str_contains(implode('', $segments), '_')) {
        $separator = '_';
    }

    return implode($separator, $words);
}

/**
 * Hands the lines to the two renamers, types first so a member rename finds its type at its new name.
 *
 * @param  list<string>  $typeLines
 * @param  list<string>  $memberLines
 */
function applyRenames(array $typeLines, array $memberLines): int
{
    $status = 0;

    foreach ([
        [
            'move.php',
            $typeLines,
        ],
        [
            'rename-member.php',
            $memberLines,
        ],
    ] as [$renamer, $lines]) {
        if ($lines === []) {
            continue;
        }

        $list = (string) tempnam(sys_get_temp_dir(), 'renames');
        file_put_contents($list, implode("\n", $lines)."\n");
        passthru(escapeshellarg(PHP_BINARY).' '.escapeshellarg(__DIR__."/{$renamer}").' --list='.escapeshellarg($list), $code);
        unlink($list);
        $status = max($status, $code);
    }

    return $status;
}

/**
 * The frontend renamer's line for one name: "<file>:<line> old new", the name without the component it is in.
 *
 * @param  array{word: string, replacement: string, verb: bool}  $options
 */
function frontendRenameLine(DeclaredName $declared, array $options): string
{
    $own = (string) preg_replace('/^.*::/', '', $declared->name);

    return "{$declared->place} {$own} ".replacedWord($own, $options);
}

/**
 * Hands every frontend rename to rename-frontend.cjs at once, which renames them on one load of the language service.
 *
 * @param  list<DeclaredName>  $names
 * @param  array{word: string, replacement: string, verb: bool}  $options
 */
function applyFrontendRenames(array $names, array $options): int
{
    if ($names === []) {
        return 0;
    }

    $list = (string) tempnam(sys_get_temp_dir(), 'frontend-renames');
    file_put_contents($list, implode("\n", array_map(fn (DeclaredName $declared) => frontendRenameLine($declared, $options), $names))."\n");
    passthru('node '.escapeshellarg(__DIR__.'/rename-frontend.cjs').' --list='.escapeshellarg($list), $code);
    unlink($list);

    return $code;
}
