<?php

declare(strict_types=1);

/**
 * Renames PHP identifiers by token across folders: variables, properties, methods, constants and named arguments
 * spelled with an old name, and the same variables in doc comments. String literals are never changed, so array keys,
 * column names and wire fields keep their spelling until they are renamed on purpose.
 *
 *   php tools/refactoring/rename-identifiers.php --map=old:new,old2:new2 --skip=app/Processes app domain tests
 *   php tools/refactoring/rename-identifiers.php ... --dry-run
 */
$options = getopt('', ['map:', 'skip::', 'dry-run'], $rest);
$map = [];

foreach (explode(',', (string) ($options['map'] ?? '')) as $pair) {
    [$old, $new] = explode(':', $pair) + [1 => ''];

    if ($old !== '' && $new !== '') {
        $map[$old] = $new;
    }
}

$skips = array_filter(explode(',', (string) ($options['skip'] ?? '')));
$roots = array_slice($argv, $rest);
$isDryRun = array_key_exists('dry-run', $options);
$changedFiles = 0;
$changedTokens = 0;

foreach ($roots as $root) {
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));

    foreach ($files as $file) {
        $path = $file->getPathname();

        if (! str_ends_with($path, '.php') || isSkipped($path, $skips)) {
            continue;
        }

        $source = (string) file_get_contents($path);
        [$renamed, $count] = renameIn($source, $map);

        if ($count === 0) {
            continue;
        }

        $changedFiles++;
        $changedTokens += $count;
        echo "{$path}: {$count}\n";

        if (! $isDryRun) {
            file_put_contents($path, $renamed);
        }
    }
}

echo ($isDryRun ? 'Would rename' : 'Renamed')." {$changedTokens} identifier(s) in {$changedFiles} file(s).\n";

/**
 * @param  list<string>  $skips
 */
function isSkipped(string $path, array $skips): bool
{
    foreach ($skips as $skip) {
        if (str_starts_with($path, rtrim($skip, '/').'/') || $path === $skip) {
            return true;
        }
    }

    return false;
}

/**
 * @param  array<string, string>  $map
 * @return array{string, int}
 */
function renameIn(string $source, array $map): array
{
    $tokens = PhpToken::tokenize($source);
    $count = 0;
    $output = '';

    foreach ($tokens as $index => $token) {
        $text = $token->text;

        if ($token->is(T_VARIABLE) && isset($map[substr($text, 1)])) {
            $text = '$'.$map[substr($text, 1)];
        } elseif ($token->is(T_DOC_COMMENT)) {
            $text = preg_replace_callback(
                '/\$('.implode('|', array_map('preg_quote', array_keys($map))).')\b/',
                fn (array $match) => '$'.$map[$match[1]],
                $text,
            );
        } elseif ($token->is(T_STRING) && isset($map[$text]) && isMemberName($tokens, $index)) {
            $text = $map[$text];
        }

        if ($text !== $token->text) {
            $count++;
        }

        $output .= $text;
    }

    return [
        $output,
        $count,
    ];
}

/**
 * Whether the name token at this place names a member or a named argument: after ->, ?->, :: or function, or before
 * a single colon of a named argument.
 *
 * @param  list<PhpToken>  $tokens
 */
function isMemberName(array $tokens, int $index): bool
{
    $previous = neighbour($tokens, $index, -1);
    $next = neighbour($tokens, $index, 1);

    if ($previous !== null && ($previous->is([
        T_OBJECT_OPERATOR,
        T_NULLSAFE_OBJECT_OPERATOR,
        T_DOUBLE_COLON,
        T_FUNCTION,
    ]))) {
        return true;
    }

    return $next !== null && $next->text === ':' && ($previous === null || in_array($previous->text, ['(', ','], true));
}

/**
 * @param  list<PhpToken>  $tokens
 */
function neighbour(array $tokens, int $index, int $step): PhpToken|null
{
    for ($at = $index + $step; isset($tokens[$at]); $at += $step) {
        if (! $tokens[$at]->is([T_WHITESPACE, T_COMMENT, T_DOC_COMMENT])) {
            return $tokens[$at];
        }
    }

    return null;
}
