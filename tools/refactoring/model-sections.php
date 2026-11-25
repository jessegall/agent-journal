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
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/sections.php';
require_once __DIR__.'/php-parse.php';

/** The sections a method is placed in by what it is, never kept in because it sits there. */
const BY_LOOKS = [
    'Accessors',
    'Asserts',
];

const SECTIONS = [
    'Constructors',
    'Mutations',
    'Getters',
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
 * Whether a method sits above the sections, before the Constructors divider: the casts and the boot hooks, so the
 * divider stands right above the first constructor (user message 22026).
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
    $returns = $method->returnType instanceof Name ? $method->returnType->getLast() : '';
    $isScope = str_starts_with($name, 'scope') || str_contains($body, '#[Scope]');

    return match (true) {
        $isScope => 'Scopes',
        isAccessor($method) => 'Accessors',
        in_array($returns, RELATIONS, true) => 'Relations',
        str_starts_with($name, 'assert') => 'Asserts',
        ! $method->isPublic() => 'Internals',
        $method->isStatic() && preg_match(ROW_MAKES, $body) === 1 => 'Constructors',
        $method->isStatic() => 'Queries',
        $returns === 'void' || preg_match(ROW_WRITES, $body) === 1 => 'Mutations',
        default => 'Getters',
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
 * inlined into that constructor (user message 22060).
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
 * A constructor is named create, or createFor and what it is made from when the model has several (user message
 * 22052); one that writes a batch through insertRows is createMany or createManyFor and returns the ids it wrote
 * (user message 22070). None for any other method.
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
 * The section a method already sits in, by the last marker above it, as long as that section is a known one and the
 * method is no accessor; none for a method with no marker above it, so it is placed by its looks.
 *
 * @param  array<int, string>  $marked
 */
function currentSectionOf(array $marked, ClassMethod $method): string|null
{
    $current = null;

    foreach ($marked as $offset => $name) {
        if ($offset < startOf($method) && in_array($name, SECTIONS, true) && ! in_array($name, BY_LOOKS, true)) {
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
