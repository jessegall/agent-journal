<?php

declare(strict_types=1);

/*
 * Lists every query clause an Eloquent model writes by hand outside its scopes and relations: a where, an order, a
 * when or a join lives in a named scope, and the model's other methods chain scopes (user message 22047).
 *
 *   php tools/refactoring/model-clauses.php app domain
 */

use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/** A query builder call that narrows or orders the rows: it belongs in a scope. */
const CLAUSE = '/^(where(?!Key(Not)?\b)\w*|orWhere\w*|having\w*|orderBy\w*|latest|oldest|when|unless|join|leftJoin|rightJoin|groupBy)$/';

/** The relation types a relation method returns; its constraints are part of the relation. */
const RELATION_TYPES = [
    'BelongsTo', 'BelongsToMany', 'HasMany', 'HasOne', 'HasManyThrough', 'HasOneThrough', 'MorphTo', 'MorphMany',
    'MorphOne', 'MorphToMany', 'MorphedByMany',
];

/**
 * Whether a method may write clauses: a scope, or a relation that constrains what it relates.
 */
function mayWriteClauses(ClassMethod $method): bool
{
    if (str_starts_with($method->name->toString(), 'scope')) {
        return true;
    }

    foreach ($method->attrGroups as $group) {
        foreach ($group->attrs as $attribute) {
            if ($attribute->name->getLast() === 'Scope') {
                return true;
            }
        }
    }

    return $method->returnType instanceof Name && in_array($method->returnType->getLast(), RELATION_TYPES, true);
}

/**
 * The faults of one model as "line<TAB>fault".
 *
 * @return list<string>
 */
function clauseFaultsOf(Class_ $model): array
{
    $faults = [];

    foreach ($model->getMethods() as $method) {
        if (mayWriteClauses($method)) {
            continue;
        }

        $calls = new NodeFinder()->find(
            $method->stmts ?? [],
            fn ($node) => ($node instanceof MethodCall || $node instanceof StaticCall) && $node->name instanceof Identifier
                && preg_match(CLAUSE, $node->name->toString()) === 1,
        );

        foreach ($calls as $call) {
            $faults[] = "{$call->getStartLine()}\tmethod {$method->name} writes {$call->name} by hand; name it as a scope";
        }
    }

    return $faults;
}

/**
 * @param  list<string>  $arguments
 */
function runModelClauses(array $arguments): int
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $faultCount = 0;

    foreach (array_slice($arguments, 1) as $path) {
        foreach (phpFiles($path) as $file) {
            $source = (string) file_get_contents($file);
            $models = array_filter(
                new NodeFinder()->findInstanceOf(parsedOnce($parser, $file, $source), Class_::class),
                isModel(...),
            );

            foreach ($models as $model) {
                foreach (clauseFaultsOf($model) as $fault) {
                    $faultCount++;
                    echo "{$file}:{$fault}\n";
                }
            }
        }
    }

    if ($faultCount === 0) {
        return 0;
    }

    return 1;
}

// Run as a command, not when another tool loads these functions.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    exit(runModelClauses($argv));
}
