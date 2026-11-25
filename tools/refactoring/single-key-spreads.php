<?php

declare(strict_types=1);

/*
 * Lists every spread of a call to a method of the same class whose every return is an array of one and the same fixed
 * key, declared in the class or a class it extends: the caller names that key and the method returns only its value
 * (user message 22066). A spread of a method with several keys, or a key worked out at run time, stays allowed.
 *
 *   php tools/refactoring/single-key-spreads.php app domain tools
 */

use PhpParser\Node;
use PhpParser\Node\ArrayItem;
use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Expr\ArrayDimFetch;
use PhpParser\Node\Expr\ArrowFunction;
use PhpParser\Node\Expr\Assign;
use PhpParser\Node\Expr\Closure;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/**
 * The returns of a method's own body, leaving out those of the closures and arrow functions written in it.
 *
 * @return list<Return_>
 */
function ownReturnsOf(ClassMethod $method): array
{
    $returns = [];
    $pending = $method->stmts ?? [];

    while ($pending !== []) {
        $node = array_shift($pending);

        if ($node instanceof Closure || $node instanceof ArrowFunction || $node instanceof ClassLike) {
            continue;
        }

        if ($node instanceof Return_) {
            $returns[] = $node;
        }

        foreach ($node->getSubNodeNames() as $name) {
            $child = $node->{$name};
            $children = is_array($child) ? $child : [$child];
            $pending = [...$pending, ...array_filter($children, fn (mixed $one) => $one instanceof Node)];
        }
    }

    return $returns;
}

/**
 * The one fixed key every return of the method hands back alone, as an array literal or as a local array the method
 * fills only under that key; none when a return gives anything else.
 */
function singleKeyOf(ClassMethod $method): string|null
{
    $keys = [];

    foreach (ownReturnsOf($method) as $return) {
        $key = $return->expr instanceof Variable
            ? keyFilledInto($method, $return->expr)
            : keyOfLiteral($return->expr);

        if ($key === null) {
            return null;
        }

        $keys[$key] = true;
    }

    if (count($keys) !== 1) {
        return null;
    }

    return array_key_first($keys);
}

/**
 * The key of an array literal of one fixed key; none for any other value.
 */
function keyOfLiteral(Node|null $value): string|null
{
    if (! $value instanceof Array_ || count($value->items) !== 1) {
        return null;
    }

    $item = $value->items[0];

    if (! $item instanceof ArrayItem || $item->unpack || ! $item->key instanceof String_) {
        return null;
    }

    return $item->key->value;
}

/**
 * The one key a method fills its local array under: it starts empty and every other write sets that fixed key.
 */
function keyFilledInto(ClassMethod $method, Variable $local): string|null
{
    $keys = [];
    $writes = new NodeFinder()->find($method->stmts ?? [], fn (Node $node) => $node instanceof Assign
        && namesLocal($node->var, $local));

    foreach ($writes as $write) {
        if ($write->var instanceof Variable) {
            if (! $write->expr instanceof Array_ || $write->expr->items !== []) {
                return null;
            }

            continue;
        }

        if (! $write->var->dim instanceof String_) {
            return null;
        }

        $keys[$write->var->dim->value] = true;
    }

    if (count($keys) !== 1) {
        return null;
    }

    return array_key_first($keys);
}

/**
 * Whether an assignment writes the local itself or one key of it.
 */
function namesLocal(Node $target, Variable $local): bool
{
    if ($target instanceof ArrayDimFetch) {
        $target = $target->var;
    }

    return $target instanceof Variable && $target->name === $local->name;
}

/**
 * The name of the class's own method a spread calls: $this->name(...) or self::name(...) and static::name(...).
 */
function ownMethodCalled(Node $value): string|null
{
    if ($value instanceof MethodCall && $value->var instanceof Variable && $value->var->name === 'this') {
        if ($value->name instanceof Identifier) {
            return $value->name->toString();
        }

        return null;
    }

    if ($value instanceof StaticCall && $value->class instanceof Name && in_array($value->class->toLowerString(), [
        'self',
        'static',
    ], true)) {
        if ($value->name instanceof Identifier) {
            return $value->name->toString();
        }

        return null;
    }

    return null;
}

/**
 * What a class holds for the scan: the class it extends, its methods of one fixed key, and its spreads of its own calls.
 *
 * @return array{parent: string|null, singleKeys: array<string, string>, spreads: list<array{string, int}>}
 */
function spreadFactsOf(ClassLike $class, NodeFinder $finder): array
{
    $singleKeys = [];

    foreach ($class->getMethods() as $method) {
        $key = singleKeyOf($method);

        if ($key !== null) {
            $singleKeys[$method->name->toString()] = $key;
        }
    }

    $spreads = [];

    foreach ($finder->find($class->stmts, fn (Node $node) => $node instanceof ArrayItem && $node->unpack) as $spread) {
        $called = ownMethodCalled($spread->value);

        if ($called !== null) {
            $spreads[] = [
                $called,
                $spread->getStartLine(),
            ];
        }
    }

    $parent = $class instanceof Class_ && $class->extends !== null ? $class->extends->toString() : null;

    return [
        'parent' => $parent,
        'singleKeys' => $singleKeys,
        'spreads' => $spreads,
    ];
}

/**
 * The fixed key of the method as the class or a class it extends declares it; none when neither gives one.
 *
 * @param  array<string, array{parent: string|null, singleKeys: array<string, string>}>  $classes
 */
function inheritedSingleKey(array $classes, string $class, string $method): string|null
{
    $seen = [];

    while (isset($classes[$class]) && ! isset($seen[$class])) {
        $seen[$class] = true;

        if (isset($classes[$class]['singleKeys'][$method])) {
            return $classes[$class]['singleKeys'][$method];
        }

        $class = $classes[$class]['parent'] ?? '';
    }

    return null;
}

/**
 * @param  list<string>  $arguments
 */
function runSingleKeySpreads(array $arguments): int
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $finder = new NodeFinder();
    $classes = [];
    $files = [];

    foreach (array_slice($arguments, 1) as $path) {
        foreach (phpFiles($path) as $file) {
            $ast = parsedOnce($parser, $file, (string) file_get_contents($file));
            $ast = new NodeTraverser(new NameResolver())->traverse($ast);

            foreach ($finder->findInstanceOf($ast, ClassLike::class) as $class) {
                if ($class->namespacedName !== null) {
                    $classes[$class->namespacedName->toString()] = spreadFactsOf($class, $finder);
                    $files[$class->namespacedName->toString()] = $file;
                }
            }
        }
    }

    $faultCount = 0;

    foreach ($classes as $name => $facts) {
        foreach ($facts['spreads'] as [$called, $line]) {
            $key = inheritedSingleKey($classes, $name, $called);

            if ($key === null) {
                continue;
            }

            $faultCount++;
            echo "{$files[$name]}:{$line}\tspreads {$called}(), which only gives the key '{$key}'; name the key here and"
                ." return its value\n";
        }
    }

    if ($faultCount === 0) {
        return 0;
    }

    return 1;
}

// Run as a command, not when another tool loads these functions.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    exit(runSingleKeySpreads($argv));
}
