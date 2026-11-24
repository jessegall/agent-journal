<?php

declare(strict_types=1);

/**
 * Renames every PHP and Go name that holds one word to hold another, narrowed to a kind of name, a namespace or a
 * folder, through the syntax tree renamers: move.php for PHP types (each reference and its file), rename-member.php
 * for PHP members, parameters and variables, and gopls for Go. Without --apply it only prints the renames, so they can
 * be read first.
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
    $typeLines = [];
    $memberLines = [];

    foreach ($goChosen as $declared) {
        echo "go {$declared->place} {$declared->name} ".replacedWord($declared->name, $options)."\n";
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
    );
}

/**
 * Renames each Go name with gopls at its declaration, which follows every reference in the module.
 *
 * @param  list<DeclaredName>  $names
 * @param  array{word: string, replacement: string, verb: bool}  $options
 */
function applyGoRenames(array $names, array $options): int
{
    $status = 0;
    $gopls = trim((string) shell_exec('command -v gopls')) ?: getenv('HOME').'/go/bin/gopls';

    foreach ($names as $declared) {
        [$file, $line] = explode(':', $declared->place);
        $column = strpos((string) (file($file, FILE_IGNORE_NEW_LINES)[(int) $line - 1] ?? ''), $declared->name);
        $module = 'tools/journal-agent';
        $position = substr($file, strlen($module) + 1).":{$line}:".((int) $column + 1);
        $renamed = replacedWord($declared->name, $options);
        passthru('cd '.escapeshellarg($module).' && '.escapeshellarg($gopls).' rename -w '.escapeshellarg($position).' '.escapeshellarg($renamed), $code);
        $status = max($status, $code);
    }

    return $status;
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

    [$options['word'], $options['replacement']] = array_map(strtolower(...), $words + ['', '']);
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
        : in_array($options['word'], $words, true);
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
    $replaced = [];

    foreach ($segments[0] as $at => $segment) {
        $isMatch = strtolower($segment) === $options['word'] && (! $options['verb'] || $at === 0);
        $replaced[] = match (true) {
            ! $isMatch => $segment,
            $segment === strtoupper($segment) => strtoupper($options['replacement']),
            ctype_upper($segment[0]) => ucfirst($options['replacement']),
            default => $options['replacement'],
        };
    }

    return implode('', $replaced);
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

    foreach ([['move.php', $typeLines], ['rename-member.php', $memberLines]] as [$renamer, $lines]) {
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
