<?php

declare(strict_types=1);

/**
 * Checks that every Eloquent model's methods sit in marked sections, and sorts them into sections.
 *
 *   php tools/refactoring/model-sections.php app domain
 *       prints "file:line<TAB>what is wrong" for a method outside a section, an unknown section name, a section out
 *       of order or a section written twice, an accessor (a method returning Attribute) outside Accessors or any
 *       other method inside it, and fails while there is one.
 *   php tools/refactoring/model-sections.php --fix app domain
 *       moves each model's methods into their sections, in the rule's order, keeping each method's text whole.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\NullableType;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\UnionType;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/sections.php';
require_once __DIR__.'/php-parse.php';

/** The sections a method is placed in by what it is, never kept in because it sits there. */
const BY_LOOKS = [
    'Predicates',
    'Transformers',
    'Calculations',
    'Accessors',
    'Asserts',
];

const SECTIONS = [
    'Constructors',
    'Mutations',
    'Predicates',
    'Transformers',
    'Calculations',
    'Accessors',
    'Relations',
    'Asserts',
    'Internals',
    'Queries',
    'Scopes',
];

const RELATIONS = [
    'BelongsTo',
    'BelongsToMany',
    'HasMany',
    'HasOne',
    'HasManyThrough',
    'HasOneThrough',
    'MorphTo',
    'MorphMany',
    'MorphOne',
    'MorphToMany',
    'MorphedByMany',
];

const MARKER_ANYWHERE = '/^[ \t]*\/\/ -+\[ (\w+) \]-+[ \t]*$/m';

const ROW_WRITES = '/->(save|update|delete|forceDelete|increment|decrement|forceFill|fill|touch|push|restore)\(/';

/**
 * Whether a method is an accessor: it returns an Attribute, whatever its visibility.
 */
function isAccessor(ClassMethod $method): bool
{
    return $method->returnType instanceof Name && $method->returnType->getLast() === 'Attribute';
}

/**
 * The last part of a method's declared return type: a class's short name or a built-in type; none when it declares
 * none or a union.
 */
function returnedName(ClassMethod $method): string
{
    if ($method->returnType instanceof Name) {
        return $method->returnType->getLast();
    }

    if ($method->returnType instanceof Identifier) {
        return $method->returnType->toLowerString();
    }

    return '';
}

/**
 * Whether a method answers yes or no: its declared return type is bool.
 */
function returnsBool(ClassMethod $method): bool
{
    return $method->returnType instanceof Identifier && $method->returnType->toLowerString() === 'bool';
}

/**
 * Whether a method's declared type is a string, an int or a float, with or without null: what a calculation gives.
 */
function returnsScalar(ClassMethod $method): bool
{
    $type = $method->returnType instanceof NullableType ? $method->returnType->type : $method->returnType;
    $parts = $type instanceof UnionType ? $type->types : [$type];
    $names = array_map(fn (mixed $part) => $part instanceof Identifier ? $part->toLowerString() : '', $parts);
    $scalars = array_diff($names, ['null']);

    $isScalar = fn (string $name) => in_array($name, [
        'string',
        'int',
        'float',
    ], true);

    return $scalars !== [] && array_all($scalars, $isScalar);
}

/**
 * Whether a method sits above the sections, before the Constructors divider: the casts and the boot hooks, so the
 * divider stands right above the first constructor.
 */
function isPreamble(ClassMethod $method): bool
{
    return in_array($method->name->toString(), [
        'casts',
        'boot',
        'booted',
    ], true);
}

/**
 * The section a method belongs in, read from its name, visibility, return type and what its body does.
 */
function sectionOf(ClassMethod $method, string $body): string
{
    $name = $method->name->toString();
    $returns = returnedName($method);
    $isScope = str_starts_with($name, 'scope') || str_contains($body, '#[Scope]');

    return match (true) {
        $isScope => 'Scopes',
        isAccessor($method) => 'Accessors',
        in_array($returns, RELATIONS, true) => 'Relations',
        str_starts_with($name, 'assert') => 'Asserts',
        ! $method->isPublic() => 'Internals',
        $method->isStatic() && preg_match(ROW_MAKES, $body) === 1 => 'Constructors',
        $method->isStatic() => 'Queries',
        in_array($returns, [
            'void',
            'never',
        ], true) || preg_match(ROW_WRITES, $body) === 1 => 'Mutations',
        returnsBool($method) => 'Predicates',
        returnsScalar($method) => 'Calculations',
        default => 'Transformers',
    };
}

/**
 * The offset where a method's text starts: its first comment, or the method itself.
 */
function startOf(ClassMethod $method): int
{
    $comments = $method->getComments();

    if ($comments === []) {
        return $method->getStartFilePos();
    }

    return $comments[0]->getStartFilePos();
}

/**
 * A method's text without the section markers above it, and with its leading indentation.
 */
function textOf(string $source, ClassMethod $method): string
{
    $start = startOf($method);
    $lineStart = strrpos(substr($source, 0, $start), "\n") + 1;
    $text = substr($source, $lineStart, $method->getEndFilePos() + 1 - $lineStart);
    $lines = array_filter(explode("\n", $text), fn (string $line) => preg_match(MARKER, $line) !== 1);

    return trim(implode("\n", $lines), "\n");
}

/**
 * The model's constructors: its public static methods under the Constructors marker.
 *
 * @return list<ClassMethod>
 */
function constructorsOf(string $source, Class_ $class): array
{
    $marked = markedSections($source);

    return array_values(array_filter(
        $class->getMethods(),
        fn (ClassMethod $method) => $method->isPublic() && $method->isStatic()
            && currentSectionOf($marked, $method) === 'Constructors',
    ));
}

/**
 * How often each Class::method( is written in app, the domains and tests, by "Class::method", read once a run.
 *
 * @return array<string, int>
 */
function staticCallCounts(): array
{
    static $counts = null;

    if ($counts !== null) {
        return $counts;
    }

    $counts = [];

    foreach ([
        'app',
        'domain',
        'tests',
    ] as $folder) {
        foreach (phpFiles(dirname(__DIR__, 2).'/'.$folder) as $file) {
            preg_match_all('/\b([A-Z]\w*)::([a-z]\w*)\(/', (string) file_get_contents($file), $calls, PREG_SET_ORDER);

            foreach ($calls as [, $class, $method]) {
                $counts["{$class}::{$method}"] = ($counts["{$class}::{$method}"] ?? 0) + 1;
            }
        }
    }

    return $counts;
}

/**
 * The faults of the model's row builders that only one constructor of the model calls, once: such a builder is
 * inlined into that constructor.
 *
 * @return list<string>
 */
function inlineFaultsOf(string $source, Class_ $class): array
{
    $constructors = array_map(fn (ClassMethod $method) => $method->name->toString(), constructorsOf($source, $class));
    $callers = [];

    foreach ($class->getMethods() as $caller) {
        $calls = new NodeFinder()->find($caller->stmts ?? [], fn (Node $node) => $node instanceof StaticCall
            && $node->class instanceof Name && in_array($node->class->toLowerString(), [
                'self',
                'static',
            ], true)
            && $node->name instanceof Identifier);

        foreach ($calls as $call) {
            $callers[$call->name->toString()][] = $caller->name->toString();
        }
    }

    $faults = [];
    $className = $class->name?->toString() ?? '';

    foreach ($class->getMethods() as $method) {
        $name = $method->name->toString();
        $ownCallers = $callers[$name] ?? [];
        $outsideCount = staticCallCounts()["{$className}::{$name}"] ?? 0;

        $body = substr($source, $method->getStartFilePos(), $method->getEndFilePos() + 1 - $method->getStartFilePos());

        $isBuilder = $method->isStatic() && preg_match(ROW_MAKES, $body) === 1;

        if (! $isBuilder || count($ownCallers) !== 1 || $outsideCount > 0) {
            continue;
        }

        if (in_array($ownCallers[0], $constructors, true) && $ownCallers[0] !== $name) {
            $faults[] = "{$method->getStartLine()}\tbuilder {$name} serves only the constructor {$ownCallers[0]}: inline it";
        }
    }

    return $faults;
}

/**
 * Whether a statement calls one of the model's own asserts: $this->assertX(...), self::assertX(...) or
 * static::assertX(...).
 */
function isOwnAssert(Node\Stmt $statement): bool
{
    $call = $statement instanceof Node\Stmt\Expression ? $statement->expr : null;
    $isOwn = $call instanceof Node\Expr\MethodCall && $call->var instanceof Node\Expr\Variable && $call->var->name === 'this'
        || $call instanceof StaticCall && $call->class instanceof Name && in_array($call->class->toLowerString(), [
            'self',
            'static',
        ], true);

    return $isOwn && $call->name instanceof Identifier && str_starts_with($call->name->toString(), 'assert');
}

/**
 * The read a statement binds, as the name of its variable, when it reads one row that may be missing: ->first() or
 * ->find(...); null for any other statement.
 */
function readRowOf(Node\Stmt $statement): string|null
{
    $assign = $statement instanceof Node\Stmt\Expression ? $statement->expr : null;
    $read = $assign instanceof Node\Expr\Assign ? $assign->expr : null;
    $isRowRead = $read instanceof Node\Expr\MethodCall && $read->name instanceof Identifier
        && in_array($read->name->toString(), [
            'first',
            'find',
        ], true);

    if ($isRowRead && $assign->var instanceof Node\Expr\Variable && is_string($assign->var->name)) {
        return $assign->var->name;
    }

    return null;
}

/**
 * Whether a statement fails the read for its absence: hands the variable to an assert, or throws when it is null.
 */
function judgesAbsence(Node\Stmt $statement, string $variable): bool
{
    $handed = isOwnAssert($statement) && array_any(
        $statement->expr->getArgs(),
        fn (Node\Arg $argument) => $argument->value instanceof Node\Expr\Variable && $argument->value->name === $variable,
    );
    $throws = $statement instanceof Node\Stmt\If_
        && array_any($statement->stmts, fn (Node $node) => $node instanceof Node\Stmt\Expression && $node->expr instanceof Node\Expr\Throw_);
    $compared = $throws && new NodeFinder()->findFirst([$statement->cond], fn (Node $node) => $node instanceof Node\Expr\BinaryOp\Identical
        && ($node->left instanceof Node\Expr\Variable && $node->left->name === $variable || $node->right instanceof Node\Expr\Variable && $node->right->name === $variable)
        && ($node->left instanceof Node\Expr\ConstFetch || $node->right instanceof Node\Expr\ConstFetch)) !== null;

    return $handed || $compared;
}

/**
 * The faults of the model's asserts as "line<TAB>fault": an assert guards a
 * precondition, so it never takes a nullable model; a method calls its own asserts before its work; and a row read
 * that is judged for absence right after it is a firstOr or findOr that fails with the exception's throwing().
 *
 * @return list<string>
 */
function assertFaultsOf(Class_ $class): array
{
    $faults = [];

    foreach ($class->getMethods() as $method) {
        $name = $method->name->toString();

        foreach (str_starts_with($name, 'assert') ? $method->params : [] as $param) {
            $types = $param->type instanceof UnionType ? $param->type->types : [$param->type];
            $isNullable = $param->type instanceof NullableType
                || array_any($types, fn ($type) => $type instanceof Identifier && $type->toLowerString() === 'null');
            $inner = $param->type instanceof NullableType ? [$param->type->type] : $types;
            $takesModel = array_any($inner, fn ($type) => $type instanceof Name);

            if ($isNullable && $takesModel && $param->var instanceof Node\Expr\Variable) {
                $faults[] = "{$method->getStartLine()}\tassert {$name} takes the nullable \${$param->var->name}: an assert guards a"
                    .' precondition, so read the row with firstOr or findOr instead';
            }
        }

        $statements = array_values($method->stmts ?? []);
        $hasWorked = false;

        foreach ($statements as $at => $statement) {
            $row = readRowOf($statement);
            $next = $statements[$at + 1] ?? null;

            if ($row !== null && $next !== null && judgesAbsence($next, $row)) {
                $faults[] = "{$statement->getStartLine()}\tmethod {$name} reads \${$row} and then judges it for absence: read it"
                    .' with firstOr or findOr and the exception\'s throwing()';
            }

            // An assert of what a call returned (assertSaved($this->save())) checks that call, not a precondition.
            $checksACall = isOwnAssert($statement) && array_any(
                $statement->expr->getArgs(),
                fn (Node\Arg $argument) => $argument->value instanceof Node\Expr\CallLike,
            );

            if (isOwnAssert($statement) && ! $checksACall && $hasWorked) {
                $faults[] = "{$statement->getStartLine()}\tmethod {$name} calls an assert after its work: call each assert first";
            }

            $isBinding = $statement instanceof Node\Stmt\Expression && $statement->expr instanceof Node\Expr\Assign
                && $statement->expr->var instanceof Node\Expr\Variable && $statement->expr->var->name !== 'this';
            // A leave-early guard (if (...) { return ...; }) decides that nothing is to be done, which is no work.
            $isGuard = $statement instanceof Node\Stmt\If_ && $statement->else === null && $statement->elseifs === []
                && array_all($statement->stmts, fn (Node $node) => $node instanceof Node\Stmt\Return_);
            $hasWorked = $hasWorked || ! isOwnAssert($statement) && ! $isBinding && ! $isGuard || $checksACall;
        }
    }

    return $faults;
}

/**
 * A constructor is named create, or createFor and what it is made from when the model has several (user message
 * 22052); one that writes a batch through insertRows is createMany or createManyFor and returns the ids it wrote
 *. None for any other method.
 */
function constructorNameFault(ClassMethod $method, string|null $section, int $constructorCount): string|null
{
    $name = $method->name->toString();

    if ($section !== 'Constructors' || ! $method->isPublic() || ! $method->isStatic()) {
        return null;
    }

    $isBatch = new NodeFinder()->findFirst($method->stmts ?? [], fn (Node $node) => $node instanceof StaticCall
        && $node->name instanceof Identifier && $node->name->toString() === 'insertRows') !== null;
    $prefix = 'create';

    if ($isBatch) {
        $prefix = 'createMany';
    }

    if ($isBatch && ! ($method->returnType instanceof Identifier && $method->returnType->toString() === 'array')) {
        return "batch constructor {$name} returns the ids of the rows it wrote, as an array";
    }

    if ($constructorCount === 1 && $name !== $prefix) {
        return "constructor {$name} is the model's only one, so it is named {$prefix}";
    }

    if ($constructorCount > 1 && preg_match('/^'.$prefix.'For[A-Z]/', $name) !== 1) {
        return "constructor {$name} is one of {$constructorCount}, so it is named {$prefix}For and what it is made from";
    }

    return null;
}

/**
 * Why a method does not belong in the answer section it sits in: a predicate answers yes or no, a transformer gives an
 * object, a calculation gives a scalar an accessor cannot.
 */
function lookFaultOf(ClassMethod $method, string $section): string|null
{
    $name = $method->name->toString();
    $isRowAnswer = $method->isPublic() && ! $method->isStatic();

    if (isAccessor($method)) {
        return null;
    }

    if ($section === 'Predicates' && (! $isRowAnswer || ! returnsBool($method))) {
        return "method {$name} answers no yes or no, so it does not belong in Predicates";
    }

    $returnsNothing = $method->returnType instanceof Identifier
        && in_array($method->returnType->toLowerString(), [
            'void',
            'never',
        ], true);

    $givesObject = ! returnsBool($method) && ! returnsScalar($method) && ! $returnsNothing;

    if ($section === 'Transformers' && (! $isRowAnswer || ! $givesObject)) {
        return "method {$name} gives no object, so it does not belong in Transformers";
    }

    if ($section === 'Calculations' && (! $isRowAnswer || ! returnsScalar($method))) {
        return "method {$name} gives no string, int or float, so it does not belong in Calculations";
    }

    return null;
}

/**
 * The faults of a model's sections as "line<TAB>fault".
 *
 * @return list<string>
 */
function faultsOf(string $source, Class_ $class): array
{
    $constructorCount = count(constructorsOf($source, $class));

    $check = function (ClassMethod $method, string|null $section) use ($constructorCount): string|null {
        $name = $method->name->toString();

        if (isPreamble($method)) {
            if ($section === null) {
                return null;
            }

            return "method {$name} sits in {$section}; it belongs above the sections, before the Constructors divider";
        }

        if ($section === null) {
            return "method {$name} is outside a section";
        }

        $constructorFault = constructorNameFault($method, $section, $constructorCount);

        if ($constructorFault !== null) {
            return $constructorFault;
        }

        $isAssert = str_starts_with($name, 'assert');

        if ($isAssert && $section !== 'Asserts') {
            return "assert method {$name} sits in {$section}, not in Asserts";
        }

        if (! $isAssert && $section === 'Asserts') {
            return "method {$name} is no assert method, so it does not belong in Asserts";
        }

        $lookFault = lookFaultOf($method, $section);

        if ($lookFault !== null) {
            return $lookFault;
        }

        if (isAccessor($method) === ($section === 'Accessors')) {
            return null;
        }

        if (isAccessor($method)) {
            return "accessor {$name} sits in {$section}, not in Accessors";
        }

        return "method {$name} is no accessor, so it does not belong in Accessors";
    };

    return [
        ...sectionFaults($source, $class, SECTIONS, $check),
        ...inlineFaultsOf($source, $class),
        ...assertFaultsOf($class),
    ];
}

/**
 * The sections the source's markers open, by the offset where each marker line starts.
 *
 * @return array<int, string>
 */
function markedSections(string $source): array
{
    $marked = [];

    if (preg_match_all(MARKER_ANYWHERE, $source, $matches, PREG_OFFSET_CAPTURE) === 0) {
        return $marked;
    }

    foreach ($matches[1] as $at => $match) {
        $marked[$matches[0][$at][1]] = $match[0];
    }

    return $marked;
}

/**
 * The section a method already sits in, by the last marker above it, as long as that section is a known one kept by
 * place; none under a section placed by looks, an unknown one or no marker, so the method is placed by its looks.
 *
 * @param  array<int, string>  $marked
 */
function currentSectionOf(array $marked, ClassMethod $method): string|null
{
    $current = null;

    foreach ($marked as $offset => $name) {
        if ($offset >= startOf($method)) {
            continue;
        }

        $current = null;

        if (in_array($name, SECTIONS, true) && ! in_array($name, BY_LOOKS, true)) {
            $current = $name;
        }
    }

    return $current;
}

/**
 * The section the fixer puts a method in: an accessor in Accessors and an assert method in Asserts always, a static
 * method not named create out of Constructors into Queries, any other method in the section it already sits in, or
 * where its looks put it.
 *
 * @param  array<int, string>  $marked
 */
function placedSection(array $marked, ClassMethod $method, string $body): string
{
    if (isAccessor($method)) {
        return 'Accessors';
    }

    if (str_starts_with($method->name->toString(), 'assert')) {
        return 'Asserts';
    }

    $current = currentSectionOf($marked, $method);

    if ($current === 'Constructors' && $method->isStatic() && ! str_starts_with($method->name->toString(), 'create')) {
        return 'Queries';
    }

    return $current ?? sectionOf($method, $body);
}

/**
 * The model's source with its methods sorted into sections: a method stays in the section it already sits in, an
 * accessor goes to Accessors, and a method with no section yet goes where its looks put it.
 */
function sorted(string $source, Class_ $class): string
{
    $methods = $class->getMethods();

    if ($methods === []) {
        return $source;
    }

    foreach ($class->stmts as $member) {
        if (! $member instanceof ClassMethod && $member->getStartLine() > $methods[0]->getStartLine()) {
            throw new RuntimeException(
                "A member below the first method stays put; move it up: line {$member->getStartLine()}",
            );
        }
    }

    $sections = array_fill_keys(SECTIONS, []);
    $preamble = [];
    $marked = markedSections($source);

    foreach ($methods as $method) {
        if (isPreamble($method)) {
            $preamble[] = textOf($source, $method);

            continue;
        }

        $body = substr($source, startOf($method), $method->getEndFilePos() + 1 - startOf($method));
        $sections[placedSection($marked, $method, $body)][] = textOf($source, $method);
    }

    $parts = $preamble;

    foreach (array_filter($sections) as $name => $texts) {
        $parts[] = "    // ----------[ {$name} ]----------\n\n".implode("\n\n", $texts);
    }

    $first = startOf($methods[0]);
    $start = strrpos(substr($source, 0, $first), "\n") + 1;
    $end = end($methods)->getEndFilePos() + 1;

    return substr($source, 0, $start).implode("\n\n", $parts).substr($source, $end);
}

/**
 * Checks or sorts the models under each path the command names, and exits with whether they are in order.
 *
 * @param  list<string>  $arguments
 */
function runModelSections(array $arguments): int
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $fix = in_array('--fix', $arguments, true);
    $faultCount = 0;

    foreach (array_values(array_diff(array_slice($arguments, 1), ['--fix'])) as $path) {
        foreach (phpFiles($path) as $file) {
            $source = (string) file_get_contents($file);
            $models = array_filter(
                new NodeFinder()->findInstanceOf(parsedOnce($parser, $file, $source), Class_::class),
                isModel(...),
            );

            foreach ($models as $class) {
                if ($fix) {
                    $source = sorted($source, $class);
                    file_put_contents($file, $source);

                    continue;
                }

                foreach (faultsOf($source, $class) as $fault) {
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
    exit(runModelSections($argv));
}
