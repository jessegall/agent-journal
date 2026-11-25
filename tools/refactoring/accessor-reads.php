<?php

declare(strict_types=1);

/**
 * Lists the reads of a model's Attribute accessor written by its camel case method name ($this->startUnavailableReason)
 * where the snake case column name is the one way to read it ($this->start_unavailable_reason), as the generated
 *
 * @property block names it. It checks $this inside the model and a variable whose
 * declared parameter type is the model.
 *
 *   php tools/refactoring/accessor-reads.php app domain
 *       prints "file:line<TAB>..." for each such read, and fails while there is one.
 */

use Illuminate\Support\Str;
use PhpParser\Node;
use PhpParser\Node\Expr\NullsafePropertyFetch;
use PhpParser\Node\Expr\PropertyFetch;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\FunctionLike;
use PhpParser\Node\Stmt\Class_;
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
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $accessors = [];
    $reads = [];

    // One pass keeps each file's accessors and candidate reads, so no tree stays in memory past its file.
    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            if (preg_match('#(^|/)domain/[^/]+/tests/#', $file) === 1) {
                continue;
            }

            $traverser = new NodeTraverser(new NameResolver());
            $nodes = $traverser->traverse(parsedOnce($parser, $file, file_get_contents($file)));
            $accessors = [...$accessors, ...accessorsOf($nodes)];

            foreach (typedReads($nodes) as $read) {
                $reads[] = [
                    $file,
                    ...$read,
                ];
            }
        }
    }

    $faults = [];

    foreach ($reads as [$file, $line, $model, $name]) {
        if (in_array($name, $accessors[$model] ?? [], true)) {
            $snake = Str::snake($name);
            $faults[] = "{$file}:{$line}\treads {$model}'s accessor as ->{$name}: read it as ->{$snake}";
        }
    }

    $faults = array_values(array_unique($faults));

    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * The camel case Attribute accessors each model of a file declares, by the model's class name.
 *
 * @param  list<Node>  $nodes
 * @return array<string, list<string>>
 */
function accessorsOf(array $nodes): array
{
    $accessors = [];

    foreach (new NodeFinder()->findInstanceOf($nodes, Class_::class) as $class) {
        if (! isModel($class) || $class->namespacedName === null) {
            continue;
        }

        foreach ($class->getMethods() as $method) {
            $name = $method->name->toString();

            if ($method->returnType instanceof Node\Name && $method->returnType->getLast() === 'Attribute'
                && preg_match('/[A-Z]/', $name) === 1) {
                $accessors[$class->namespacedName->toString()][] = $name;
            }
        }
    }

    return $accessors;
}

/**
 * The camel case property reads of a file whose receiver has a known class: $this inside a class, or a parameter
 * declared with a class. Each is its line, the receiver's class and the property's name.
 *
 * @param  list<Node>  $nodes
 * @return list<array{int, string, string}>
 */
function typedReads(array $nodes): array
{
    $finder = new NodeFinder();
    $reads = [];

    foreach ($finder->findInstanceOf($nodes, Class_::class) as $class) {
        $own = $class->namespacedName?->toString();

        foreach ($finder->find($class, fn (Node $node) => $node instanceof FunctionLike) as $function) {
            $types = parameterClasses($function);

            if ($own !== null) {
                $types['this'] = $own;
            }

            foreach ($finder->find($function->getStmts() ?? [], fn (Node $node) => isNamedFetch($node)) as $fetch) {
                $name = $fetch->name->toString();
                $type = $types[$fetch->var->name] ?? null;

                if ($type !== null && preg_match('/[A-Z]/', $name) === 1) {
                    $reads[] = [
                        $fetch->getStartLine(),
                        $type,
                        $name,
                    ];
                }
            }
        }
    }

    return $reads;
}

/**
 * The parameters of a function or closure declared with a class, by the parameter's name.
 *
 * @return array<string, string>
 */
function parameterClasses(FunctionLike $function): array
{
    $classes = [];

    foreach ($function->getParams() as $parameter) {
        $type = $parameter->type instanceof Node\NullableType ? $parameter->type->type : $parameter->type;

        if ($type instanceof Node\Name && $parameter->var instanceof Variable && is_string($parameter->var->name)) {
            $classes[$parameter->var->name] = $type->toString();
        }
    }

    return $classes;
}

/**
 * Whether the node reads a property of a plain variable by a written name.
 */
function isNamedFetch(Node $node): bool
{
    return ($node instanceof PropertyFetch || $node instanceof NullsafePropertyFetch)
        && $node->var instanceof Variable && is_string($node->var->name)
        && $node->name instanceof Node\Identifier;
}
