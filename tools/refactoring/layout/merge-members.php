<?php

declare(strict_types=1);

/*
 * Before a merge, carries the members of each merged class into the class that keeps them, from the syntax tree: its
 * constants, properties, trait uses and methods with their comments, the interfaces it implements and the imports they
 * need. It writes nothing and names each clash when a member name is in both classes or both have a constructor.
 *
 *   php tools/refactoring/layout/merge-members.php <moves.txt> [--root=<tree>]
 */

use PhpParser\Node;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Property;
use PhpParser\Node\Stmt\Use_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;

require dirname(__DIR__, 3).'/vendor/autoload.php';
require_once dirname(__DIR__).'/php-parse.php';
require_once __DIR__.'/class-members.php';

main($argv);

/**
 * @param  list<string>  $arguments
 */
function main(array $arguments): void
{
    $root = dirname(__DIR__, 3);
    $listPath = null;

    foreach (array_slice($arguments, 1) as $argument) {
        str_starts_with($argument, '--root=') ? $root = substr($argument, 7) : $listPath = $argument;
    }

    $listPath ?? exit(failure(['Name a moves file.']));
    $merges = mergeRows($listPath);
    $written = [];
    $clashes = [];

    foreach ($merges as [$old, $kept, $from, $to]) {
        $keptSource = $written[$to] ?? (string) file_get_contents("{$root}/{$to}");
        $result = mergedSource((string) file_get_contents("{$root}/{$from}"), $keptSource, $old, $kept);
        is_string($result) ? $written[$to] = $result : array_push($clashes, ...$result);
    }

    if ($clashes !== []) {
        exit(failure(['Nothing was merged:', ...$clashes]));
    }

    foreach ($written as $file => $source) {
        file_put_contents("{$root}/{$file}", $source);
    }

    printf("%d classes merged into %d\n", count($merges), count($written));
}

/**
 * The rows of the moves file marked merge: old class, kept class, old file, kept file.
 *
 * @return list<array{string, string, string, string}>
 */
function mergeRows(string $listPath): array
{
    $rows = [];

    foreach (file($listPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        [$old, $kept, $from, $to, $mode] = array_pad(preg_split('/\s+/', trim($line)) ?: [], 5, '');

        if ($mode === 'merge') {
            $rows[] = [
                ltrim($old, '\\'),
                ltrim($kept, '\\'),
                $from,
                $to,
            ];
        }
    }

    return $rows;
}

/**
 * The kept file with the old class's members, interfaces and imports added, or the clashes that stop the merge.
 *
 * @return string|list<string>
 */
function mergedSource(string $oldSource, string $keptSource, string $old, string $kept): string|array
{
    $oldTree = resolvedTree("{$old} (merged)", $oldSource);
    $keptTree = resolvedTree("{$kept} (kept)", $keptSource);
    $oldClass = soleClass($oldTree) ?? exit(failure(["{$old} declares no class."]));
    $keptClass = soleClass($keptTree) ?? exit(failure(["{$kept} declares no class."]));
    $clashes = clashesBetween($oldClass, $keptClass, $old, $kept);

    if ($clashes !== []) {
        return $clashes;
    }

    $edits = [
        ...memberEdit($oldSource, $oldClass, $keptSource, $keptClass),
        ...interfaceEdit($oldClass, $keptClass, $kept),
        ...importEdits($oldTree, $keptTree, $keptSource, $old, $kept),
    ];
    usort($edits, fn (array $left, array $right) => $right[0] <=> $left[0]);

    foreach ($edits as [$start, $end, $text]) {
        $keptSource = substr($keptSource, 0, $start).$text.substr($keptSource, $end);
    }

    return $keptSource;
}

/**
 * @return list<Node>
 */
function resolvedTree(string $file, string $source): array
{
    $tree = parsedOnce($file, $source);
    new NodeTraverser(new NameResolver(null, ['replaceNodes' => false]))->traverse($tree);

    return $tree;
}

/**
 * @param  list<Node>  $tree
 */
function soleClass(array $tree): Class_|null
{
    $classes = new NodeFinder()->findInstanceOf($tree, Class_::class);

    if (count($classes) === 1) {
        return $classes[0];
    }

    return null;
}

/**
 * Every member name both classes declare, and a constructor in both.
 *
 * @return list<string>
 */
function clashesBetween(Class_ $oldClass, Class_ $keptClass, string $old, string $kept): array
{
    $keptNames = memberNames($keptClass);
    $clashes = [];

    foreach (memberNames($oldClass) as $name) {
        if (in_array($name, $keptNames, true)) {
            $clashes[] = "{$old} and {$kept} both declare {$name}: rename one before the merge.";
        }
    }

    return $clashes;
}

/**
 * The constants, properties and methods a class declares, each as a kind and its name.
 *
 * @return list<string>
 */
function memberNames(Class_ $class): array
{
    $names = [];

    foreach ($class->stmts as $member) {
        $names = [
            ...$names,
            ...match (true) {
                $member instanceof ClassConst => array_map(fn ($constant) => "constant {$constant->name}", $member->consts),
                $member instanceof Property => array_map(fn ($property) => "property \${$property->name}", $member->props),
                $member instanceof ClassMethod => [
                    "method {$member->name}()",
                    ...promotedNames($member),
                ],
                default => [],
            },
        ];
    }

    return $names;
}

/**
 * @return list<string>
 */
function promotedNames(ClassMethod $method): array
{
    $promoted = array_filter($method->params, fn (Node\Param $param) => $param->flags !== 0);

    return array_values(array_map(fn (Node\Param $param) => "property \${$param->var->name}", $promoted));
}

/**
 * The kept class's body with the old class's members in it. A class laid out in sections gets them before its closing
 * brace; any other is laid out again: trait uses, constants, properties, the constructor, public, then private methods.
 *
 * @return list<array{int, int, string}>
 */
function memberEdit(string $oldSource, Class_ $oldClass, string $keptSource, Class_ $keptClass): array
{
    if ($oldClass->stmts === []) {
        return [];
    }

    $brace = $keptClass->getEndFilePos();

    if (str_contains(substr($keptSource, $keptClass->getStartFilePos(), $brace - $keptClass->getStartFilePos()), '// ----------[')) {
        $before = rtrim(substr($keptSource, 0, $brace));
        $members = implode("\n\n", array_map(fn (Node $member) => memberText($oldSource, $member), $oldClass->stmts));

        return [[
            strlen($before),
            $brace,
            "\n\n{$members}\n",
        ]];
    }

    $members = [
        ...array_map(fn (Node $member) => [
            memberRank($member),
            memberText($keptSource, $member),
        ], $keptClass->stmts),
        ...array_map(fn (Node $member) => [
            memberRank($member),
            memberText($oldSource, $member),
        ], $oldClass->stmts),
    ];
    $ranked = array_keys($members);
    usort($ranked, fn (int $left, int $right) => [
        $members[$left][0],
        $left,
    ] <=> [
        $members[$right][0],
        $right,
    ]);
    $body = implode("\n\n", array_map(fn (int $index) => $members[$index][1], $ranked));
    $open = (int) strpos($keptSource, '{', ($keptClass->name ?? $keptClass)->getEndFilePos()) + 1;

    return [[
        $open,
        $brace,
        "\n{$body}\n",
    ]];
}

/**
 * The interfaces the old class implements that the kept class does not, added to its implements list.
 *
 * @return list<array{int, int, string}>
 */
function interfaceEdit(Class_ $oldClass, Class_ $keptClass, string $kept): array
{
    $keptInterfaces = array_map(fn (Name $name) => resolved($name), $keptClass->implements);
    $added = array_values(array_filter(
        $oldClass->implements,
        fn (Name $name) => ! in_array(resolved($name), $keptInterfaces, true),
    ));

    if ($added === []) {
        return [];
    }

    $names = implode(', ', array_map(fn (Name $name) => '\\'.resolved($name), $added));

    if ($keptClass->implements !== []) {
        $last = $keptClass->implements[count($keptClass->implements) - 1];

        return [[
            $last->getEndFilePos() + 1,
            $last->getEndFilePos() + 1,
            ", {$names}",
        ]];
    }

    $after = $keptClass->extends ?? $keptClass->name ?? exit(failure(["{$kept} has no name to add implements after."]));

    return [[
        $after->getEndFilePos() + 1,
        $after->getEndFilePos() + 1,
        " implements {$names}",
    ]];
}

/**
 * The old file's imports the kept file lacks, after its last import, and the kept file's import of the old class gone.
 *
 * @param  list<Node>  $oldTree
 * @param  list<Node>  $keptTree
 * @return list<array{int, int, string}>
 */
function importEdits(array $oldTree, array $keptTree, string $keptSource, string $old, string $kept): array
{
    $keptImports = new NodeFinder()->findInstanceOf($keptTree, Use_::class);
    $keptNames = importedNames($keptImports);
    $edits = [];
    $added = [];

    foreach (new NodeFinder()->findInstanceOf($oldTree, Use_::class) as $statement) {
        foreach ($statement->uses as $use) {
            $full = $use->name->toString();

            if ($full !== $kept && $full !== $old && ! in_array($full, $keptNames, true)) {
                $alias = $use->alias === null ? '' : " as {$use->alias}";
                $prefix = match ($statement->type) {
                    Use_::TYPE_FUNCTION => 'function ',
                    Use_::TYPE_CONSTANT => 'const ',
                    default => '',
                };
                $added[] = "use {$prefix}{$full}{$alias};";
            }
        }
    }

    foreach ($keptImports as $statement) {
        if (count($statement->uses) === 1 && $statement->uses[0]->name->toString() === $old) {
            $lineEnd = strpos($keptSource, "\n", $statement->getEndFilePos());
            $edits[] = [
                $statement->getStartFilePos(),
                $lineEnd === false ? strlen($keptSource) : $lineEnd + 1,
                '',
            ];
        }
    }

    if ($added !== []) {
        $at = $keptImports === [] ? namespaceEnd($keptTree) : $keptImports[count($keptImports) - 1]->getEndFilePos() + 1;
        $edits[] = [
            $at,
            $at,
            "\n".implode("\n", array_unique($added)),
        ];
    }

    return $edits;
}

/**
 * @param  list<Use_>  $imports
 * @return list<string>
 */
function importedNames(array $imports): array
{
    $names = [];

    foreach ($imports as $statement) {
        foreach ($statement->uses as $use) {
            $names[] = $use->name->toString();
        }
    }

    return $names;
}

/**
 * @param  list<Node>  $tree
 */
function namespaceEnd(array $tree): int
{
    $namespace = new NodeFinder()->findFirstInstanceOf($tree, Node\Stmt\Namespace_::class)
        ?? exit(failure(['The kept file declares no namespace.']));

    return $namespace->name->getEndFilePos() + 2;
}

function resolved(Name $name): string
{
    $resolved = $name->getAttribute('resolvedName');

    if ($resolved instanceof Name) {
        return $resolved->toString();
    }

    return $name->toString();
}

/**
 * @param  list<string>  $lines
 */
function failure(array $lines): int
{
    fwrite(STDERR, implode("\n", $lines)."\n");

    return 1;
}
