<?php

declare(strict_types=1);

/**
 * Lists every name the code declares, one per line as "kind<TAB>name<TAB>file:line", so the names can be read and
 * judged together: classes, interfaces, traits and enums, and their methods, properties, constants and enum cases.
 *
 *   php tools/refactoring/list-names.php app tests/Architecture/Support > names.tsv
 */

use PhpParser\Node;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\Node\Stmt\EnumCase;
use PhpParser\Node\Stmt\Interface_;
use PhpParser\Node\Stmt\Property;
use PhpParser\Node\Stmt\Trait_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$folders = array_slice($argv, 1);
$parser = (new ParserFactory)->createForNewestSupportedVersion();
$finder = new NodeFinder;

foreach ($folders as $folder) {
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS));

    foreach ($files as $file) {
        if (! $file instanceof SplFileInfo || $file->getExtension() !== 'php') {
            continue;
        }

        $path = $file->getPathname();
        $statements = (new NodeTraverser(new NameResolver))->traverse($parser->parse((string) file_get_contents($path)) ?? []);

        foreach ($finder->findInstanceOf($statements, ClassLike::class) as $type) {
            if ($type->name === null) {
                continue;
            }

            printName(kindOf($type), $type->name->toString(), $path, $type->getStartLine());

            foreach ($type->stmts as $member) {
                foreach (membersOf($member) as [$kind, $name]) {
                    printName($kind, $type->name->toString().'::'.$name, $path, $member->getStartLine());
                }
            }
        }
    }
}

function kindOf(ClassLike $type): string
{
    return match (true) {
        $type instanceof Interface_ => 'interface',
        $type instanceof Trait_ => 'trait',
        $type instanceof Enum_ => 'enum',
        $type instanceof Class_ => 'class',
        default => 'type',
    };
}

/**
 * @return list<array{string, string}>
 */
function membersOf(Node $member): array
{
    return match (true) {
        $member instanceof ClassMethod => [['method', $member->name->toString().'()'], ...promotedProperties($member)],
        $member instanceof Property => array_map(fn ($property) => ['property', '$'.$property->name->toString()], $member->props),
        $member instanceof ClassConst => array_map(fn ($constant) => ['constant', $constant->name->toString()], $member->consts),
        $member instanceof EnumCase => [['case', $member->name->toString()]],
        default => [],
    };
}

/**
 * @return list<array{string, string}>
 */
function promotedProperties(ClassMethod $method): array
{
    $properties = [];

    foreach ($method->params as $param) {
        if ($param->flags !== 0 && $param->var instanceof Node\Expr\Variable && is_string($param->var->name)) {
            $properties[] = ['property', '$'.$param->var->name];
        }
    }

    return $properties;
}

function printName(string $kind, string $name, string $path, int $line): void
{
    echo "{$kind}\t{$name}\t{$path}:{$line}\n";
}
