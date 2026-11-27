<?php

/**
 * Renames the array keys that fill a Data class through Class::from([...]), collect or validateAndCreate, after its
 * properties were renamed: the syntax tree says which array feeds which class, so a key of another class is left.
 *
 *   php tools/refactoring/rename-data-keys.php --list=renames.txt [--dry-run]
 *
 * A list line reads `property Full\Class\Name old new`, as rename-member.php takes it.
 */

declare(strict_types=1);

require __DIR__.'/../../vendor/autoload.php';
require_once __DIR__.'/php-parse.php';

use PhpParser\Node;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitor\ParentConnectingVisitor;

const KEY_FOLDERS = [
    'app',
    'domain',
    'tests',
    'routes',
    'database',
    'tools',
];
const FILLING_METHODS = [
    'from',
    'collect',
    'validateAndCreate',
    'optional',
];

main($argv);

/**
 * @param  list<string>  $arguments
 */
function main(array $arguments): void
{
    $root = dirname(__DIR__, 2);
    $listPath = substr((string) current(array_filter($arguments, fn (string $argument) => str_starts_with($argument, '--list='))), 7);
    $isDryRun = in_array('--dry-run', $arguments, true);
    $renames = renamesByClass($listPath);
    $total = 0;

    foreach (phpFiles($root) as $path) {
        $code = (string) file_get_contents("{$root}/{$path}");

        if (! array_any(array_keys($renames), fn (string $class) => str_contains($code, substr($class, (int) strrpos($class, '\\') + 1)))) {
            continue;
        }

        $statements = new NodeTraverser(new NameResolver(), new ParentConnectingVisitor())->traverse(parsedOnce($path, $code));
        $edits = keyEdits($statements, $renames);

        if ($edits === []) {
            continue;
        }

        $total += count($edits);
        printf("%s: %d key(s)\n", $path, count($edits));

        if (! $isDryRun) {
            file_put_contents("{$root}/{$path}", applied($code, $edits));
        }
    }

    printf("%s %d key(s)\n", $isDryRun ? 'Would rename' : 'Renamed', $total);
}

/**
 * @return array<string, array<string, string>> class => old => new
 */
function renamesByClass(string $listPath): array
{
    $renames = [];

    foreach (file($listPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $parts = preg_split('/\s+/', trim($line)) ?: [];

        if (count($parts) === 4 && $parts[0] === 'property') {
            $renames[ltrim($parts[1], '\\')][$parts[2]] = $parts[3];
        }
    }

    return $renames;
}

/**
 * @return list<string>
 */
function phpFiles(string $root): array
{
    $listed = shell_exec('git -C '.escapeshellarg($root).' ls-files -- '.implode(' ', array_map(fn (string $folder) => escapeshellarg("{$folder}/*.php"), KEY_FOLDERS)));

    return array_values(array_filter(explode("\n", (string) $listed), fn (string $path) => $path !== '' && ! str_contains($path, '/migrations/')));
}

/**
 * The key edits of every array that fills a renamed class.
 *
 * @param  list<Node>  $statements
 * @param  array<string, array<string, string>>  $renames
 * @return list<array{int, int, string}>
 */
function keyEdits(array $statements, array $renames): array
{
    $edits = [];

    foreach (new NodeFinder()->findInstanceOf($statements, Node\Expr\StaticCall::class) as $call) {
        $class = calledClass($call);

        if ($class === null || ! isset($renames[$class]) || ! $call->name instanceof Node\Identifier
            || ! in_array($call->name->toString(), FILLING_METHODS, true) || $call->isFirstClassCallable()) {
            continue;
        }

        foreach ($call->getArgs() as $argument) {
            array_push($edits, ...arrayKeyEdits($argument->value, $renames[$class]));
        }
    }

    return $edits;
}

function calledClass(Node\Expr\StaticCall $call): string|null
{
    if (! $call->class instanceof Node\Name) {
        return null;
    }

    if (! in_array($call->class->toLowerString(), ['self', 'static'], true)) {
        return $call->class->toString();
    }

    $node = $call;

    while ($node !== null && ! $node instanceof Node\Stmt\ClassLike) {
        $node = $node->getAttribute('parent');
    }

    return $node?->namespacedName?->toString();
}

/**
 * The keys of an array literal, also one wrapped in a call such as array_filter([...]) or a list of such arrays.
 *
 * @param  array<string, string>  $renamed
 * @return list<array{int, int, string}>
 */
function arrayKeyEdits(Node\Expr $value, array $renamed): array
{
    if ($value instanceof Node\Expr\FuncCall) {
        return array_merge([], ...array_map(fn (Node\Arg $argument) => arrayKeyEdits($argument->value, $renamed), $value->getArgs()));
    }

    if (! $value instanceof Node\Expr\Array_) {
        return [];
    }

    $edits = [];

    foreach ($value->items as $item) {
        if ($item->key instanceof Node\Scalar\String_ && isset($renamed[$item->key->value])) {
            $quote = $item->key->getAttribute('kind') === Node\Scalar\String_::KIND_DOUBLE_QUOTED ? '"' : "'";
            $edits[] = [
                $item->key->getStartFilePos(),
                $item->key->getEndFilePos(),
                $quote.$renamed[$item->key->value].$quote,
            ];
        } elseif ($item->key === null && $item->value instanceof Node\Expr\Array_) {
            // a list of rows, as collect takes it
            array_push($edits, ...arrayKeyEdits($item->value, $renamed));
        }
    }

    return $edits;
}

/**
 * @param  list<array{int, int, string}>  $edits
 */
function applied(string $code, array $edits): string
{
    usort($edits, fn (array $first, array $second) => $second[0] <=> $first[0]);

    foreach ($edits as [$start, $end, $text]) {
        $code = substr_replace($code, $text, $start, $end - $start + 1);
    }

    return $code;
}
