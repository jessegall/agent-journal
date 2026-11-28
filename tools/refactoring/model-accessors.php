<?php

declare(strict_types=1);

/**
 * Finds the model answers that take nothing and return no bool, which belong in a Laravel accessor, and the
 * accessors whose closure has a side effect; and turns those answers into accessors.
 *
 *   php tools/refactoring/model-accessors.php app domain
 *       prints "file:line<TAB>what is wrong" for each such answer and each accessor with a side effect, and fails
 *       while there is one.
 *   php tools/refactoring/model-accessors.php --fix [--keep=App\\Models\\Ask::typeKey,...] app domain
 *       rewrites each such answer but the kept ones as a protected accessor; run model-sections.php --fix after it to move them into
 *       the Accessors section, and PHPStan to find the callers that still call them.
 */

use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/model-sections.php';
require_once __DIR__.'/php-parse.php';

/** The types of a string, an int or a float, as a declaration or a documented type writes them. */
const SCALAR_TYPES = '/^(string|int|float|non-falsy-string|non-empty-string|positive-int|negative-int|non-negative-int|'
    .'numeric-string|lowercase-string|int<[^>]*>)$/';

/**
 * What an accessor's closure, or an answer that may become one, must never do: write, dispatch, run, throw, assert or
 * change the model; an accessor only reads its row.
 */
const SIDE_EFFECTS = '/->(save|update|delete|forceDelete|increment|decrement|forceFill|fill|touch|push|restore|raise)\(|'
    .'\bdispatch\(|\bevent\(|->dispatch\(|->run\(|file_get_contents|file_put_contents|Process::|\bthrow\b|'
    .'\$this->assert\w*\(|self::assert\w*\(|\$this->\w+\s*(=[^=>]|\?\?=|\+=|-=|\.=)/';

/** What a body does when it reads rows, which an accessor never does, so such an answer stays a method. */
const ROW_READS = '/::query\(|->query\(|\b(self|static)::\w*[wW]here|DB::|->load(Missing|Count)?\(|'
    .'\$this->\w+\(\)->(where|get|first|sole|count|exists|pluck|latest|oldest|orderBy|find)\w*\(/';

/** The static answers of a model that name it and read no row: its stored actor type and its link type. */
const NAMING_STATICS = [
    'storedType',
    'linkType',
];

/** The return types an answer keeps as a method: a question, nothing, or the model itself. */
const METHOD_RETURNS = [
    'bool',
    'void',
    'never',
    'static',
    'self',
    'Attribute',
    'Builder',
];

/**
 * Whether a parent, an interface or a trait of the model declares the method too, so the method answers a contract.
 */
function answersAContract(string $class, string $method): bool
{
    $type = Reflector::of($class);
    $others = [
        ...array_slice($type->lineage(), 1),
        ...$type->interfaces(),
        ...$type->allTraits(),
    ];

    return array_any($others, fn (Reflector $other) => $other->hasMethod($method));
}

/**
 * Whether the method reads rows: itself, through a static method of another model, or through a method of its own
 * model that does.
 *
 * @param  list<string>  $followed  the methods of the model already followed, so a loop of calls ends
 */
function readsRows(string $source, string $class, Class_ $model, ClassMethod $method, array $followed): bool
{
    $body = substr($source, $method->getStartFilePos(), $method->getEndFilePos() + 1 - $method->getStartFilePos());

    if (preg_match(ROW_READS, $body) === 1) {
        return true;
    }

    $finder = new NodeFinder();

    foreach ($finder->findInstanceOf($method, Node\Expr\StaticCall::class) as $call) {
        $called = $call->class instanceof Node\Name ? importedName($source, $call->class->toString()) : '';
        $isNaming = $call->name instanceof Node\Identifier && in_array($call->name->toString(), NAMING_STATICS, true);

        if (! $isNaming && $called !== $class && Reflector::exists($called) && Reflector::of($called)->isSubclassOf(Model::class)) {
            return true;
        }
    }

    $type = Reflector::of($class);

    foreach ($finder->findInstanceOf($method, Node\Expr\MethodCall::class) as $call) {
        $name = $call->name instanceof Node\Identifier ? $call->name->toString() : '';
        $isOwn = $call->var instanceof Node\Expr\Variable && $call->var->name === 'this';

        if (! $isOwn || in_array($name, $followed, true) || ! $type->hasMethod($name)) {
            continue;
        }

        $own = $model->getMethod($name);

        if ($own !== null && readsRows($source, $class, $model, $own, [...$followed, $method->name->toString()])) {
            return true;
        }
    }

    return false;
}

/**
 * The full name a short class name in the source stands for, by its use lines or its namespace.
 */
function importedName(string $source, string $name): string
{
    $short = explode('\\', $name)[0];

    if (preg_match('/^use ((?:[\w\\\\]+\\\\)?'.preg_quote($short, '/').');/m', $source, $imported) === 1) {
        return $imported[1].substr($name, strlen($short));
    }

    preg_match('/^namespace\s+([^;]+);/m', $source, $namespace);

    return $namespace[1].'\\'.$name;
}

/**
 * Whether the method types the column of its own name, which an accessor of that name would hide; a cast types it.
 */
function readsItsOwnColumn(ClassMethod $method, string $body): bool
{
    $column = strtolower((string) preg_replace('/(?<!^)[A-Z]/', '_$0', $method->name->toString()));

    return preg_match('/\$this->'.$column.'\b/', $body) === 1;
}

/**
 * Whether a public answer of the row, an accessor or a transformer, gives a model: its declared type, or an accessor's
 * documented one, names a model class.
 */
function returnsModel(string $source, ClassMethod $method): bool
{
    if (! $method->isPublic() && ! isAccessor($method) || $method->isStatic()) {
        return false;
    }

    $type = isAccessor($method) ? accessorTypeOf($method) : returnedName($method);
    $parts = array_diff(explode('|', ltrim($type, '?')), ['null']);

    return array_any($parts, function (string $part) use ($source): bool {
        if (preg_match('/^\w+$/', $part) !== 1 || in_array($part, ['self', 'static'], true)) {
            return false;
        }

        $full = importedName($source, $part);

        if (! Reflector::exists($full)) {
            return false;
        }

        return Reflector::of($full)->isSubclassOf(Model::class);
    });
}

/**
 * Whether a type is one an accessor may give: a string, an int, a float, a backed enum or an object that is no model
 *; a bool is a predicate's, another model a relation's, and an array belongs
 * in Data.
 */
function givesAccessorValue(string $source, string $type): bool
{
    $parts = array_diff(explode('|', ltrim($type, '?')), ['null']);

    return $parts !== [] && array_all(
        $parts,
        fn (string $part) => isScalarPart($source, $part) || isObjectPart($source, $part),
    );
}

/**
 * Whether one part of a type names a class or interface that is no model, as a property read may give.
 */
function isObjectPart(string $source, string $part): bool
{
    if (preg_match('/^\\\\?[A-Z][\\w\\\\]*(<.*>)?$/', $part) !== 1) {
        return false;
    }

    $full = importedName($source, preg_replace('/<.*$/', '', ltrim($part, '\\')));

    if (! Reflector::exists($full)) {
        return false;
    }

    $type = Reflector::of($full);

    return ! $type->isTrait() && ! $type->isEnum() && ! $type->isSubclassOf(Model::class);
}

/**
 * Whether one part of a type is a scalar, a backed enum or one case of a backed enum.
 */
function isScalarPart(string $source, string $part): bool
{
    if (preg_match(SCALAR_TYPES, $part) === 1) {
        return true;
    }

    if (preg_match('/^(\w+)(::\w+)?$/', $part, $enum) !== 1) {
        return false;
    }

    $full = importedName($source, $enum[1]);

    if (! Reflector::exists($full)) {
        return false;
    }

    return Reflector::of($full)->backingType()->isDefined();
}

/**
 * Whether a model method takes nothing, changes nothing and gives a string, int, float or backed enum, so it is an
 * accessor; one that names what it throws keeps it in a method's contract, which a property read cannot carry.
 */
function belongsInAccessor(string $source, string $class, Class_ $model, ClassMethod $method): bool
{
    $returns = $method->returnType;
    $returned = $returns instanceof Node\Identifier || $returns instanceof Node\Name ? $returns->toString() : '';
    $body = substr($source, startOf($method), $method->getEndFilePos() + 1 - startOf($method));

    return $method->isPublic()
        && ! $method->isStatic()
        && ! $method->isAbstract()
        && $method->params === []
        && givesAccessorValue($source, $returned)
        && ! str_starts_with($method->name->toString(), '__')
        && in_array(sectionOf($method, $body), ['Calculations', 'Transformers'], true)
        && preg_match(SIDE_EFFECTS, $body) !== 1
        && ! readsRows($source, $class, $model, $method, [])
        && ! str_contains((string) $method->getDocComment()?->getText(), '@throws')
        && ! readsItsOwnColumn($method, $body)
        && ! answersAContract($class, $method->name->toString());
}

/**
 * The faults of one model as "line<TAB>fault".
 *
 * @return list<string>
 */
function accessorFaultsOf(string $source, string $class, Class_ $model): array
{
    $faults = [];

    foreach ($model->getMethods() as $method) {
        $name = $method->name->toString();
        $body = substr($source, $method->getStartFilePos(), $method->getEndFilePos() + 1 - $method->getStartFilePos());

        if (isAccessor($method) && preg_match(SIDE_EFFECTS, $body) === 1) {
            $faults[] = "{$method->getStartLine()}\taccessor {$name} has a side effect: it writes, throws, asserts, "
                .'dispatches or runs something, so make it a plain method';
        }

        if (isAccessor($method) && str_contains($body, 'withoutObjectCaching')) {
            $faults[] = "{$method->getStartLine()}\taccessor {$name} calls withoutObjectCaching, which "
                .'App\\Models\\Support\\Accessor already does';
        }

        if (isAccessor($method) && readsRows($source, $class, $model, $method, [])) {
            $faults[] = "{$method->getStartLine()}\taccessor {$name} reads rows";
        }

        if (isAccessor($method) && ! givesAccessorValue($source, accessorTypeOf($method))) {
            $faults[] = "{$method->getStartLine()}\taccessor {$name} gives ".accessorTypeOf($method)
                .'; an accessor gives a string, int, float, backed enum or object, so make a yes or no a predicate';
        }

        if (isAccessor($method) && preg_match('/\bAttribute::(get|make|set)\(/', $body) === 1) {
            $faults[] = "{$method->getStartLine()}\taccessor {$name} is built with Laravel's Attribute: build it with "
                .'App\\Models\\Support\\Accessor';
        }

        $isAnswer = isAccessor($method) || sectionOf($method, $body) === 'Transformers';

        if ($isAnswer && returnsModel($source, $method)) {
            $faults[] = "{$method->getStartLine()}\tmethod {$name} gives a model; reach another model through a relation";
        }

        if (belongsInAccessor($source, $class, $model, $method)) {
            $faults[] = "{$method->getStartLine()}\tanswer {$name} takes nothing and gives a string, int, float, enum or"
                .' object, so it is an accessor';
        }
    }

    return $faults;
}

/**
 * The type an accessor gives, from its documented Attribute<type, never>; mixed when it documents none.
 */
function accessorTypeOf(ClassMethod $method): string
{
    $documented = (string) $method->getDocComment()?->getText();

    if (preg_match('/@return\s+Attribute<(.+), never>/', $documented, $found) === 1) {
        return trim($found[1]);
    }

    return 'mixed';
}

/**
 * The type an accessor of the method gets and gives: its documented return type, or its declared one.
 */
function returnedTypeOf(string $source, ClassMethod $method): string
{
    $documented = (string) $method->getDocComment()?->getText();

    if (preg_match('/@return\s+(.+?)\s*$/m', $documented, $found) === 1) {
        return $found[1];
    }

    $type = $method->returnType;

    return substr($source, $type->getStartFilePos(), $type->getEndFilePos() + 1 - $type->getStartFilePos());
}

/**
 * The method's doc comment as the accessor's: its words kept, its @return naming the Attribute.
 */
function accessorDocOf(ClassMethod $method, string $returned): string
{
    $lines = array_values(array_filter(
        explode("\n", (string) $method->getDocComment()?->getText()),
        fn (string $line) => ! str_contains($line, '@return') && ! in_array(trim($line), ['', '/**', '*/'], true),
    ));

    while ($lines !== [] && trim(end($lines)) === '*') {
        array_pop($lines);
    }

    $words = $lines === [] ? '' : implode("\n", $lines)."\n     *\n";

    return "    /**\n{$words}     * @return Attribute<{$returned}, never>\n     */\n";
}

/**
 * The method's body as the closure the accessor hands to Accessor::get.
 */
function accessorClosureOf(string $source, ClassMethod $method): string
{
    $statements = $method->stmts ?? [];

    if (count($statements) === 1 && $statements[0] instanceof Return_ && $statements[0]->expr !== null) {
        $expression = $statements[0]->expr;

        return 'fn () => '.substr(
            $source,
            $expression->getStartFilePos(),
            $expression->getEndFilePos() + 1 - $expression->getStartFilePos(),
        );
    }

    $first = $statements[0];
    $lineStart = strrpos(substr($source, 0, $first->getStartFilePos()), "\n") + 1;
    $body = substr($source, $lineStart, end($statements)->getEndFilePos() + 1 - $lineStart);
    $indented = preg_replace('/^(?=.)/m', '    ', $body);

    return "function () {\n{$indented}\n        }";
}

/**
 * The method rewritten as a protected accessor.
 */
function accessorOf(string $source, ClassMethod $method): string
{
    $returned = returnedTypeOf($source, $method);

    return accessorDocOf($method, $returned)
        ."    protected function {$method->name->toString()}(): Attribute\n    {\n"
        .'        return Accessor::get('.accessorClosureOf($source, $method).");\n    }";
}

/**
 * The model's source with every answer that belongs in an accessor rewritten as one, last first so the offsets of
 * the others hold; the answers named in $kept, as Class::method, stay for a rewrite by hand.
 *
 * @param  list<string>  $kept
 */
function withAccessors(string $source, string $class, Class_ $model, array $kept): string
{
    $methods = array_reverse(array_filter(
        $model->getMethods(),
        fn (ClassMethod $method) => belongsInAccessor($source, $class, $model, $method)
            && ! in_array("{$class}::{$method->name->toString()}", $kept, true),
    ));

    foreach ($methods as $method) {
        $start = strrpos(substr($source, 0, startOf($method)), "\n") + 1;
        $source = substr($source, 0, $start).accessorOf($source, $method).substr($source, $method->getEndFilePos() + 1);
    }

    return $source;
}

/**
 * The class the parsed model declares, by its namespace and name.
 */
function classNameOf(string $source, Class_ $model): string
{
    preg_match('/^namespace\s+([^;]+);/m', $source, $namespace);

    return $namespace[1].'\\'.$model->name?->toString();
}

$fix = in_array('--fix', $argv, true);
$keptOption = array_values(preg_grep('/^--keep=/', $argv) ?: []);
$kept = $keptOption === [] ? [] : explode(',', substr($keptOption[0], strlen('--keep=')));
$faultCount = 0;

foreach (array_values(array_diff(array_slice($argv, 1), ['--fix', ...$keptOption])) as $path) {
    foreach (phpFiles($path) as $file) {
        $source = (string) file_get_contents($file);
        $models = array_filter(
            new NodeFinder()->findInstanceOf(parsedOnce($file, $source), Class_::class),
            isModel(...),
        );

        foreach ($models as $model) {
            $class = classNameOf($source, $model);

            if ($fix) {
                $changed = withAccessors($source, $class, $model, $kept);

                if ($changed !== $source) {
                    file_put_contents($file, $changed);
                    echo "{$file}\n";
                }

                continue;
            }

            foreach (accessorFaultsOf($source, $class, $model) as $fault) {
                $faultCount++;
                echo "{$file}:{$fault}\n";
            }
        }
    }
}

exit($faultCount === 0 ? 0 : 1);
