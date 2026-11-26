<?php

declare(strict_types=1);

/**
 * Suggests the indexes the models' queries want, run by hand: it follows every query chain through each model's scopes
 * to the columns one query uses together, and compares them with the indexes the create migrations declare.
 *
 *   php tools/refactoring/scope-indexes.php --migrations=database/migrations,domain app domain
 *       prints, per table, each query no index serves, with the index it suggests (equality columns first, then the
 *       range or order column) and where the query is written.
 */

use Illuminate\Support\Str;
use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

ini_set('memory_limit', '2G');

/** The builder calls that match a column against one value or a set of values. */
const EQUALITY_CALLS = [
    'where',
    'whereIn',
    'whereNotIn',
    'whereNull',
    'whereNotNull',
    'whereKey',
    'whereKeyNot',
];

/** The builder calls that bound a column to a range. */
const RANGE_CALLS = [
    'whereBetween',
    'whereNotBetween',
    'whereDate',
    'whereTime',
    'whereColumn',
    'whereLike',
];

/** The builder calls that order on a column, with the column each takes when it names none. */
const ORDER_CALLS = [
    'orderBy' => null,
    'orderByDesc' => null,
    'latest' => 'created_at',
    'oldest' => 'created_at',
];

/** The comparison operators of a three-part where that still match one value. */
const EQUAL_OPERATORS = [
    '=',
    '==',
    '!=',
    '<>',
    'is',
    'is not',
];

/**
 * The columns one query or scope uses: those it matches exactly, and those it bounds or orders on.
 */
final class ColumnUse
{
    /** @var list<string> */
    public array $equal = [];

    /** @var list<string> */
    public array $ranged = [];

    /** @var list<string> */
    public array $scopes = [];

    public function add(self $other): void
    {
        $this->equal = array_values(array_unique([...$this->equal, ...$other->equal]));
        $this->ranged = array_values(array_unique([...$this->ranged, ...$other->ranged]));
    }

    /**
     * The index that serves the use: its equality columns, then its first range or order column.
     *
     * @return list<string>
     */
    public function suggestedIndex(): array
    {
        $ranged = array_values(array_diff($this->ranged, $this->equal));

        return array_values(array_filter([...$this->equal, $ranged[0] ?? null]));
    }
}

/**
 * The model of a class: the table it reads and the column use of each of its scopes.
 */
final class ScopedModel
{
    /** @var array<string, ColumnUse> */
    public array $scopes = [];

    /**
     * @param  list<string>  $traits  the traits the model uses, whose scopes are its own
     */
    public function __construct(public string $table, public array $traits = []) {}

    /**
     * The use of a scope with the scopes it calls on the same model, each once.
     *
     * @param  array<string, true>  $seen
     */
    public function useOf(string $scope, array $seen = []): ColumnUse
    {
        $use = new ColumnUse();

        if (! isset($this->scopes[$scope]) || isset($seen[$scope])) {
            return $use;
        }

        $seen[$scope] = true;
        $use->add($this->scopes[$scope]);

        foreach ($this->scopes[$scope]->scopes as $called) {
            $use->add($this->useOf($called, $seen));
        }

        return $use;
    }
}

/**
 * The column a qualifyColumn('column') call names, or null for any other expression.
 */
function qualifiedColumnOf(Node|null $expression): string|null
{
    $isQualified = $expression instanceof MethodCall
        && $expression->name instanceof Node\Identifier
        && $expression->name->toString() === 'qualifyColumn';
    $column = $isQualified ? ($expression->getArgs()[0]->value ?? null) : null;

    if ($column instanceof Node\Scalar\String_) {
        return $column->value;
    }

    return null;
}

/**
 * The literal column a call names first, without its table, or null when it names none or another table's; a variable
 * bound to a qualifyColumn call names that column.
 *
 * @param  array<string, string>  $qualified  the columns of the variables bound to qualifyColumn calls
 */
function columnOf(MethodCall $call, string $table, array $qualified = []): string|null
{
    $first = $call->getArgs()[0]->value ?? null;
    $named = qualifiedColumnOf($first);

    if ($first instanceof Node\Expr\Variable && is_string($first->name) && isset($qualified[$first->name])) {
        return $qualified[$first->name];
    }

    if ($named !== null) {
        return $named;
    }

    if (! $first instanceof Node\Scalar\String_) {
        return null;
    }

    $column = $first->value;

    if (str_contains($column, '.')) {
        [$owner, $column] = explode('.', $column, 2);

        if ($owner === $table) {
            return $column;
        }

        return null;
    }

    return $column;
}

/**
 * Whether a where call compares its column with an operator other than equality.
 */
function comparesARange(MethodCall $call): bool
{
    $operator = $call->getArgs()[1]->value ?? null;

    return count($call->getArgs()) === 3
        && $operator instanceof Node\Scalar\String_
        && ! in_array(strtolower($operator->value), EQUAL_OPERATORS, true);
}

/**
 * The columns the builder calls of a body use, and the names of the other calls, which may be scopes.
 *
 * @param  list<Node>  $nodes
 */
function columnUseOf(array $nodes, string $table): ColumnUse
{
    $use = new ColumnUse();
    $qualified = [];

    foreach (new NodeFinder()->findInstanceOf($nodes, Node\Expr\Assign::class) as $assign) {
        $column = qualifiedColumnOf($assign->expr);

        if ($column !== null && $assign->var instanceof Node\Expr\Variable && is_string($assign->var->name)) {
            $qualified[$assign->var->name] = $column;
        }
    }

    foreach (new NodeFinder()->findInstanceOf($nodes, MethodCall::class) as $call) {
        if (! $call->name instanceof Node\Identifier || $call->name->toString() === 'qualifyColumn') {
            continue;
        }

        $name = $call->name->toString();
        $column = columnOf($call, $table, $qualified);

        if ($name === 'whereKey' || $name === 'whereKeyNot') {
            $use->equal[] = 'id';
        } elseif (in_array($name, EQUALITY_CALLS, true) && $column !== null) {
            comparesARange($call) ? $use->ranged[] = $column : $use->equal[] = $column;
        } elseif (in_array($name, RANGE_CALLS, true) && $column !== null) {
            $use->ranged[] = $column;
        } elseif (array_key_exists($name, ORDER_CALLS)) {
            $ordered = $column ?? ORDER_CALLS[$name];

            if ($ordered !== null) {
                $use->ranged[] = $ordered;
            }
        } else {
            $use->scopes[] = $name;
        }
    }

    $use->equal = array_values(array_unique($use->equal));
    $use->ranged = array_values(array_unique($use->ranged));

    return $use;
}

/**
 * The table a model reads: its #[Table] attribute, its $table property, or its class name in plural snake case.
 */
function tableOf(Class_ $class): string
{
    foreach ($class->attrGroups as $group) {
        foreach ($group->attrs as $attribute) {
            $argument = $attribute->args[0]->value ?? null;

            if ($attribute->name->getLast() === 'Table' && $argument instanceof Node\Scalar\String_) {
                return $argument->value;
            }
        }
    }

    foreach ($class->getProperties() as $property) {
        $default = $property->props[0]->default;

        if ($property->props[0]->name->toString() === 'table' && $default instanceof Node\Scalar\String_) {
            return $default->value;
        }
    }

    $name = $class->name->toString();

    return Str::snake(Str::pluralStudly($name));
}

/**
 * Whether a method is a query scope.
 */
function isScope(Node\Stmt\ClassMethod $method): bool
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
 * The model at the root of a query chain, as Model::query(), self::query() or static::query() names it.
 */
function rootModelOf(MethodCall $call, string $ownClass): string|null
{
    $root = $call;

    while ($root instanceof MethodCall) {
        $root = $root->var;
    }

    if (! $root instanceof StaticCall || ! $root->class instanceof Node\Name || $root->name->toString() !== 'query') {
        return null;
    }

    $class = $root->class->toString();

    if (in_array($class, ['self', 'static'], true)) {
        return $ownClass;
    }

    return ltrim($class, '\\');
}

/**
 * The method names a chain calls after its root, first to last.
 *
 * @return list<MethodCall>
 */
function chainOf(MethodCall $call): array
{
    $calls = [];

    while ($call instanceof MethodCall) {
        $calls[] = $call;
        $call = $call->var;
    }

    return array_reverse($calls);
}

/**
 * Every index a create migration declares, by table: each as its list of columns.
 *
 * @param  list<string>  $files
 * @return array<string, list<list<string>>>
 */
function indexesOf(array $files, $parser): array
{
    $indexes = [];

    foreach ($files as $file) {
        $code = file_get_contents($file);

        preg_match_all('/CREATE\s+(?:UNIQUE\s+)?INDEX\s+\w+\s+ON\s+(\w+)\s*(?:USING\s+\w+\s*)?\(([^)]*)\)/i', $code, $raw, PREG_SET_ORDER);

        foreach ($raw as [, $table, $columns]) {
            $indexes[$table][] = array_map(fn (string $column) => trim(explode(' ', trim($column))[0], '"'), explode(',', $columns));
        }

        $nodes = parsedOnce($parser, $file, $code);

        foreach (new NodeFinder()->findInstanceOf($nodes, StaticCall::class) as $create) {
            $table = $create->getArgs()[0]->value ?? null;

            if ($create->name->toString() !== 'create' || ! $table instanceof Node\Scalar\String_) {
                continue;
            }

            foreach (new NodeFinder()->findInstanceOf([$create], MethodCall::class) as $call) {
                $name = $call->name instanceof Node\Identifier ? $call->name->toString() : '';
                $declared = declaredIndexOf($call, $name);

                if ($declared !== []) {
                    $indexes[$table->value][] = $declared;
                }
            }
        }
    }

    return $indexes;
}

/**
 * The columns of an index one blueprint call declares: index, unique or primary over a list or a column, a column
 * made an index, unique or primary key, a morph pair, or an id; none for any other call.
 *
 * @return list<string>
 */
function declaredIndexOf(MethodCall $call, string $name): array
{
    $first = $call->getArgs()[0]->value ?? null;

    if (in_array($name, ['index', 'unique', 'primary'], true) && $first instanceof Node\Expr\Array_) {
        return array_values(array_filter(array_map(
            fn ($item) => $item?->value instanceof Node\Scalar\String_ ? $item->value->value : null,
            $first->items,
        )));
    }

    if (in_array($name, [
        'index',
        'unique',
        'primary',
    ], true) && $first instanceof Node\Scalar\String_ && $call->var instanceof Node\Expr\Variable) {
        return [$first->value];
    }

    if (in_array($name, ['index', 'unique', 'primary'], true) && $call->var instanceof MethodCall) {
        $column = $call->var;

        while ($column instanceof MethodCall && ! $column->var instanceof Node\Expr\Variable) {
            $column = $column->var;
        }

        $named = $column instanceof MethodCall ? ($column->getArgs()[0]->value ?? null) : null;

        if ($named instanceof Node\Scalar\String_) {
            return [$named->value];
        }

        return [];
    }

    if (in_array($name, [
        'morphs',
        'ulidMorphs',
        'uuidMorphs',
        'nullableMorphs',
        'nullableUlidMorphs',
    ], true) && $first instanceof Node\Scalar\String_) {
        return [
            "{$first->value}_type",
            "{$first->value}_id",
        ];
    }

    if ($name === 'id' && $call->var instanceof Node\Expr\Variable) {
        return ['id'];
    }

    return [];
}

/**
 * Whether an index serves a use: its first column is one the use matches exactly, or, for a use that matches none,
 * the column it bounds or orders on.
 *
 * @param  list<list<string>>  $indexes
 */
function isServed(ColumnUse $use, array $indexes): bool
{
    $leading = $use->equal !== [] ? $use->equal : array_slice($use->ranged, 0, 1);

    return array_any($indexes, fn (array $index) => in_array($index[0] ?? '', $leading, true));
}

/**
 * The lines of the report: per table, each suggested index with the places whose query wants it.
 *
 * @param  list<string>  $codeFolders
 * @param  list<string>  $migrationFolders
 * @return list<string>
 */
function scopeIndexReport(array $codeFolders, array $migrationFolders): array
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $files = array_merge(...array_map('phpFiles', $codeFolders));
    $migrations = array_merge(...array_map('phpFiles', $migrationFolders));
    $files = array_values(array_diff($files, $migrations));
    $trees = [];
    $models = [];
    $traitScopes = [];

    foreach ($files as $file) {
        $code = file_get_contents($file);

        // Only a file of the code (not a domain's tests) that starts a query or declares a scope is kept, so the run
        // holds few trees at once.
        $isDomainTest = preg_match('#(^|/)domain/[^/]+/tests/#', $file) === 1;

        if ($isDomainTest || ! str_contains($code, '::query()') && ! str_contains($code, '#[Scope]')) {
            continue;
        }

        $traverser = new NodeTraverser(new NameResolver(), new ParentConnectingVisitor());
        $trees[$file] = $traverser->traverse(parsedOnce($parser, $file, $code));

        foreach (new NodeFinder()->findInstanceOf($trees[$file], Node\Stmt\Trait_::class) as $trait) {
            foreach ($trait->getMethods() as $method) {
                if (isScope($method) && $trait->namespacedName !== null) {
                    $traitScopes[$trait->namespacedName->toString()][$method->name->toString()] = $method;
                }
            }
        }

        foreach (new NodeFinder()->findInstanceOf($trees[$file], Class_::class) as $class) {
            if (! isModel($class) || $class->namespacedName === null) {
                continue;
            }

            $traits = array_merge(...array_map(
                fn (Node\Stmt\TraitUse $use) => array_map(fn (Node\Name $name) => $name->toString(), $use->traits),
                $class->getTraitUses(),
            ));
            $model = new ScopedModel(tableOf($class), $traits);

            foreach ($class->getMethods() as $method) {
                if (isScope($method)) {
                    $model->scopes[$method->name->toString()] = columnUseOf($method->stmts ?? [], $model->table);
                }
            }

            $models[$class->namespacedName->toString()] = $model;
        }
    }

    foreach ($models as $model) {
        foreach ($model->traits as $trait) {
            foreach ($traitScopes[$trait] ?? [] as $name => $method) {
                $model->scopes[$name] ??= columnUseOf($method->stmts ?? [], $model->table);
            }
        }
    }

    $indexes = indexesOf($migrations, $parser);
    $wanted = [];

    foreach ($trees as $file => $tree) {
        foreach (new NodeFinder()->findInstanceOf($tree, Class_::class) as $class) {
            $ownClass = $class->namespacedName?->toString() ?? '';

            foreach (new NodeFinder()->findInstanceOf([$class], MethodCall::class) as $call) {
                $modelClass = rootModelOf($call, $ownClass);
                $parent = $call->getAttribute('parent');
                $isOutermost = ! ($parent instanceof MethodCall && $parent->var === $call);

                if ($modelClass === null || ! isset($models[$modelClass]) || ! $isOutermost) {
                    continue;
                }

                $model = $models[$modelClass];

                $use = new ColumnUse();
                $names = [];

                foreach (chainOf($call) as $link) {
                    $name = $link->name instanceof Node\Identifier ? $link->name->toString() : '';
                    $names[] = $name;
                    $use->add(isset($model->scopes[$name]) ? $model->useOf($name) : columnUseOf([$link], $model->table));
                }

                $index = $use->suggestedIndex();

                if ($index === [] || $index === ['id'] || isServed($use, $indexes[$model->table] ?? [])) {
                    continue;
                }

                $key = implode(', ', $index);
                $place = str_replace(getcwd().'/', '', $file).':'.$call->getStartLine();
                $wanted[$model->table][$key][] = $place.' '.class_basename($modelClass).'::query()->'.implode('()->', $names).'()';
            }
        }
    }

    ksort($wanted);
    $lines = [];

    foreach ($wanted as $table => $suggested) {
        $lines[] = "{$table}:";

        foreach ($suggested as $columns => $places) {
            $lines[] = "  index ({$columns}) for ".count($places).' '.Str::plural('query', count($places)).':';

            foreach (array_unique($places) as $place) {
                $lines[] = "    {$place}";
            }
        }
    }

    return $lines;
}

if (realpath($argv[0] ?? '') === __FILE__) {
    $options = getopt('', ['migrations:'], $rest);
    $migrationFolders = [];

    foreach (explode(',', (string) ($options['migrations'] ?? 'database/migrations')) as $pattern) {
        $migrationFolders = [...$migrationFolders, ...(glob($pattern.(str_ends_with($pattern, 'domain') ? '/*/database/migrations' : '')) ?: [])];
    }

    $lines = scopeIndexReport(array_slice($argv, $rest), $migrationFolders);

    echo $lines === [] ? "Every query of a scope has an index that serves it.\n" : implode("\n", $lines)."\n";
}
