<?php

declare(strict_types=1);

/**
 * Lists the contracts that exactly one class implements under another name. Such a class is simply what its contract
 * says, so it carries the contract's name and imports the contract with a Contract alias: final readonly class
 * AgentDirectory implements AgentDirectoryContract. Interfaces live under a Contracts folder; a class of another owner
 * than its contract's, such as a domain filling a Core contract, keeps a name of its own.
 *
 *   php tools/refactoring/single-implementations.php app domain
 *       prints "file:line<TAB>class <Class> is the only implementation of <Contract> ..." for each, and fails while
 *       there is one. Paths named with --contracts-of=<path> add contracts read from there, for a fixture.
 */

use PhpParser\Node;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\Node\Stmt\Interface_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

main(array_slice($argv, 1));

/**
 * @param  list<string>  $paths
 */
function main(array $paths): void
{
    $contracts = [];
    $implementations = [];

    foreach (declarationsIn($paths) as $declaration) {
        if ($declaration['type'] === 'interface' && str_contains($declaration['name'], '\\Contracts\\')) {
            $contracts[$declaration['name']] = true;
        }

        foreach ($declaration['implements'] as $contract) {
            $implementations[$contract][] = $declaration;
        }
    }

    $faults = [];

    foreach (array_keys($contracts) as $contract) {
        $implementers = $implementations[$contract] ?? [];

        if (count($implementers) !== 1) {
            continue;
        }

        $only = $implementers[0];

        if ($only['type'] === 'interface' || $only['isAbstract'] || shortName($only['name']) === shortName($contract)) {
            continue;
        }

        // A class of another owner fills a contract its owner declares for others, so it says what it fills it with.
        if (! str_starts_with($only['name'], ownerOf($contract))) {
            continue;
        }

        // A class that implements two contracts cannot carry both names; it keeps its own.
        $ownContracts = array_filter($only['implements'], fn (string $named) => isset($contracts[$named]));

        if (count($ownContracts) > 1) {
            continue;
        }

        $faults[] = "{$only['file']}:{$only['line']}\tclass ".shortName($only['name']).' is the only implementation of '
            .$contract.': name it '.shortName($contract).' and import the contract as '.shortName($contract).'Contract';
    }

    sort($faults);
    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * Every class, enum and interface of the paths, with the interfaces each names in its implements list.
 *
 * @param  list<string>  $paths
 * @return list<array{type: string, name: string, implements: list<string>, isAbstract: bool, file: string, line: int}>
 */
function declarationsIn(array $paths): array
{
    $parser = new ParserFactory()->createForHostVersion();
    $finder = new NodeFinder();
    $declarations = [];

    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            $traverser = new NodeTraverser(new NameResolver());
            $nodes = $traverser->traverse(parsedOnce($parser, $file, file_get_contents($file)));
            $found = $finder->find($nodes, fn (Node $node) => $node instanceof Class_
                || $node instanceof Enum_
                || $node instanceof Interface_);

            foreach ($found as $node) {
                if ($node->namespacedName === null) {
                    continue;
                }

                $declarations[] = [
                    'type' => $node instanceof Interface_ ? 'interface' : 'class',
                    'name' => $node->namespacedName->toString(),
                    'implements' => implementedBy($node),
                    'isAbstract' => $node instanceof Class_ && $node->isAbstract(),
                    'file' => $file,
                    'line' => $node->getStartLine(),
                ];
            }
        }
    }

    return $declarations;
}

/**
 * The interfaces a class or enum implements, or an interface extends: an interface that extends a contract counts as
 * one more way to implement it.
 *
 * @return list<string>
 */
function implementedBy(Class_|Enum_|Interface_ $node): array
{
    $named = $node instanceof Interface_ ? $node->extends : $node->implements;

    return array_map(fn (Node\Name $name) => $name->toString(), $named);
}

/**
 * The namespace that owns a contract: everything before its Contracts folder, such as App\\ or Domain\\Tasks\\.
 */
function ownerOf(string $contract): string
{
    return substr($contract, 0, (int) strpos($contract, '\\Contracts\\') + 1);
}

function shortName(string $name): string
{
    $parts = explode('\\', $name);

    return end($parts);
}
