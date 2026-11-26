<?php

declare(strict_types=1);

/**
 * Lists the queries written outside their model that do more than chain its scopes and read, since every filter or
 * order is a named scope: outside the model, a chain may call its scopes and then ALLOWED_READS.
 *
 *   php tools/refactoring/outside-queries.php app domain
 *       prints "file:line<TAB>query of <Model> calls <method> ..." for each, and fails while there is one.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Trait_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

ini_set('memory_limit', '4G');

/**
 * The calls a query outside its model may end in or pass through: reads, bounds, locks and aggregates, and the key
 * reads, which name rows by their identity as find does; no filter on another column.
 */
const ALLOWED_READS = [
    'first',
    'firstOr',
    'firstOrFail',
    'firstOption',
    'sole',
    'find',
    'findOr',
    'findOrFail',
    'findMany',
    'get',
    'exists',
    'doesntExist',
    'count',
    'max',
    'min',
    'sum',
    'avg',
    'pluck',
    'value',
    'cursor',
    'paginate',
    'simplePaginate',
    'cursorPaginate',
    'chunk',
    'chunkById',
    'each',
    'lazy',
    'lazyById',
    'readLimit',
    'readUpTo',
    'readExactly',
    'readAll',
    'readInChunks',
    'readRelationCompletely',
    'lockForUpdate',
    'sharedLock',
    'getModels',
    'whereKey',
    'whereKeyNot',
    'limit',
    'lock',
    'when',
    'keys',
    'excludingKeys',
];

/**
 * The reads that hand back rows or a value, and the writes to the rows the scopes chose: the chain past one of them
 * works on what it read, not on the query.
 */
const ENDING_READS = [
    'first',
    'firstOr',
    'firstOrFail',
    'firstOption',
    'sole',
    'find',
    'findOr',
    'findOrFail',
    'findMany',
    'get',
    'exists',
    'doesntExist',
    'count',
    'max',
    'min',
    'sum',
    'avg',
    'pluck',
    'value',
    'paginate',
    'simplePaginate',
    'cursorPaginate',
    'getModels',
    'cursor',
    'update',
    'delete',
    'insert',
    'upsert',
    'increment',
    'decrement',
];

/** The builder calls that filter, order, join or shape a query, which a relation read from outside never makes. */
const BUILDER_FILTER = '/^(where|orWhere|orderBy|latest|oldest|select|limit|take|skip|offset|join|leftJoin|rightJoin'
    .'|crossJoin|groupBy|having|with|has|doesntHave|distinct|inRandomOrder|reorder)/';

/** The relation types a model method returns, which make a chain from it a query of the related model. */
const RELATION_TYPES = [
    'HasMany',
    'HasOne',
    'BelongsTo',
    'BelongsToMany',
    'MorphMany',
    'MorphOne',
    'MorphTo',
    'MorphToMany',
    'HasManyThrough',
    'HasOneThrough',
];

main(array_slice($argv, 1));

/**
 * @param  list<string>  $paths
 */
function main(array $paths): void
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $trees = [];
    $scopes = [];
    $traitScopes = [];
    $modelTraits = [];
    $relations = [];
    $traitTraits = [];

    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            // A domain's tests arrange rows as they need; the rule is for the code.
            if (preg_match('#(^|/)domain/[^/]+/tests/#', $file) === 1) {
                continue;
            }

            $traverser = new NodeTraverser(new NameResolver(), new ParentConnectingVisitor());
            $trees[$file] = $traverser->traverse(parsedOnce($parser, $file, file_get_contents($file)));

            foreach (new NodeFinder()->findInstanceOf($trees[$file], Trait_::class) as $trait) {
                if ($trait->namespacedName !== null) {
                    $traitTraits[$trait->namespacedName->toString()] = traitsOf($trait);
                }

                foreach ($trait->getMethods() as $method) {
                    if ($trait->namespacedName !== null && isScopeMethod($method)) {
                        $traitScopes[$trait->namespacedName->toString()][] = $method->name->toString();
                    }
                }
            }

            foreach (new NodeFinder()->findInstanceOf($trees[$file], Class_::class) as $class) {
                if ($class->namespacedName === null || ! isModel($class)) {
                    continue;
                }

                $model = $class->namespacedName->toString();
                $scopes[$model] = [];
                $modelTraits[$model] = traitsOf($class);

                foreach ($class->getMethods() as $method) {
                    if (isScopeMethod($method)) {
                        $scopes[$model][] = $method->name->toString();
                    }

                    if (isRelation($method)) {
                        $relations[$method->name->toString()] = true;
                    }
                }
            }
        }
    }

    foreach ($modelTraits as $model => $traits) {
        $modelTraits[$model] = allTraits($traits, $traitTraits);

        foreach ($modelTraits[$model] as $trait) {
            array_push($scopes[$model], ...($traitScopes[$trait] ?? []));
        }
    }

    $faults = [];

    foreach ($trees as $file => $nodes) {
        foreach (new NodeFinder()->findInstanceOf($nodes, MethodCall::class) as $call) {
            if ($call->getAttribute('parent') instanceof MethodCall && $call->getAttribute('parent')->var === $call) {
                continue;
            }

            $fault = faultOfChain($call, $scopes, $relations, $modelTraits);

            if ($fault !== null) {
                $faults[] = "{$file}:{$call->getStartLine()}\t{$fault}";
            }
        }
    }

    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * Why the whole chain that ends in this call reaches into a model from outside, or null when it does not.
 *
 * @param  array<string, list<string>>  $scopes
 * @param  array<string, true>  $relations
 * @param  array<string, list<string>>  $modelTraits
 */
function faultOfChain(MethodCall $last, array $scopes, array $relations, array $modelTraits): string|null
{
    $calls = [];
    $root = $last;

    while ($root instanceof MethodCall) {
        array_unshift($calls, $root);
        $root = $root->var;
    }

    $writer = enclosingClassName($last);
    $model = null;
    $links = $calls;

    if ($root instanceof StaticCall && $root->class instanceof Node\Name && $root->name instanceof Node\Identifier
        && $root->name->toString() === 'query') {
        $model = ltrim($root->class->toString(), '\\');

        if (in_array($model, ['self', 'static', 'parent'], true)) {
            return null;
        }
    } elseif ($calls !== [] && $calls[0]->name instanceof Node\Identifier && isset($relations[$calls[0]->name->toString()])) {
        $model = 'a relation '.$calls[0]->name->toString();
        $links = array_slice($calls, 1);
    }

    if ($model === null || ! isset($scopes[$model]) && ! str_starts_with($model, 'a relation ')) {
        return null;
    }

    if ($writer === $model || in_array($writer, $modelTraits[$model] ?? [], true) || isTraitOfAModel($writer, $modelTraits)) {
        return null;
    }

    foreach ($links as $link) {
        if (! $link->name instanceof Node\Identifier) {
            return null;
        }

        $name = $link->name->toString();

        if (in_array($name, ENDING_READS, true)) {
            return null;
        }

        if (in_array($name, ALLOWED_READS, true)) {
            continue;
        }

        if (! isset($scopes[$model]) && preg_match(BUILDER_FILTER, $name) !== 1) {
            return null;
        }

        if (isset($scopes[$model]) && in_array($name, $scopes[$model], true)) {
            continue;
        }

        if (! isset($scopes[$model]) && isAnyScope($name, $scopes)) {
            continue;
        }

        return "query of {$model} calls {$name}: filter and order through a scope of the model, then read";
    }

    return null;
}

/**
 * Whether a method is a query scope: marked #[Scope], or named scopeX in Laravel's older way.
 */
function isScopeMethod(ClassMethod $method): bool
{
    foreach ($method->attrGroups as $group) {
        foreach ($group->attrs as $attribute) {
            if ($attribute->name->getLast() === 'Scope') {
                return true;
            }
        }
    }

    return false;
}

/**
 * Whether a model method returns one of Laravel's relations.
 */
function isRelation(ClassMethod $method): bool
{
    return $method->returnType instanceof Node\Name && in_array($method->returnType->getLast(), RELATION_TYPES, true);
}

/**
 * Whether a name is a scope of any model, as a relation's chain may call its related model's scopes.
 *
 * @param  array<string, list<string>>  $scopes
 */
function isAnyScope(string $name, array $scopes): bool
{
    return array_any($scopes, fn (array $names) => in_array($name, $names, true));
}

/**
 * @param  array<string, list<string>>  $modelTraits
 */
function isTraitOfAModel(string|null $writer, array $modelTraits): bool
{
    return $writer !== null && array_any($modelTraits, fn (array $traits) => in_array($writer, $traits, true));
}

/**
 * @return list<string>
 */
function traitsOf(Class_|Trait_ $class): array
{
    return array_merge(...array_map(
        fn (Node\Stmt\TraitUse $use) => array_map(fn (Node\Name $name) => $name->toString(), $use->traits),
        $class->getTraitUses(),
    ));
}

/**
 * The traits and the traits they use in turn.
 *
 * @param  list<string>  $traits
 * @param  array<string, list<string>>  $traitTraits
 * @return list<string>
 */
function allTraits(array $traits, array $traitTraits): array
{
    $all = [];

    while ($traits !== []) {
        $trait = array_shift($traits);

        if (in_array($trait, $all, true)) {
            continue;
        }

        $all[] = $trait;
        array_push($traits, ...($traitTraits[$trait] ?? []));
    }

    return $all;
}

/**
 * The class or trait a node is written in, or null outside one.
 */
function enclosingClassName(Node $node): string|null
{
    $parent = $node->getAttribute('parent');

    while ($parent !== null && ! $parent instanceof ClassLike) {
        $parent = $parent->getAttribute('parent');
    }

    if ($parent === null || $parent->namespacedName === null) {
        return null;
    }

    return $parent->namespacedName->toString();
}
