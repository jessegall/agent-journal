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
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/sections.php';

const SECTIONS = ['Constructors', 'Queries', 'Mutations', 'Answers', 'Accessors', 'Relations', 'Internals', 'Scopes'];

const RELATIONS = [
    'BelongsTo', 'BelongsToMany', 'HasMany', 'HasOne', 'HasManyThrough', 'HasOneThrough', 'MorphTo', 'MorphMany',
    'MorphOne', 'MorphToMany', 'MorphedByMany',
];

const MARKER_ANYWHERE = '/^[ \t]*\/\/ -+\[ (\w+) \]-+[ \t]*$/m';

const ROW_WRITES = '/->(save|update|delete|forceDelete|increment|decrement|forceFill|fill|touch|push|restore)\(/';

/**
 * Whether a method is an accessor: it returns an Attribute, whatever its visibility.
 */
function isAccessor(ClassMethod $method): bool
{
    return $method->returnType instanceof Node\Name && $method->returnType->getLast() === 'Attribute';
}

/**
 * The section a method belongs in, read from its name, visibility, return type and what its body does.
 */
function sectionOf(ClassMethod $method, string $body): string
{
    $name = $method->name->toString();
    $returns = $method->returnType instanceof Node\Name ? $method->returnType->getLast() : '';
    $isScope = str_starts_with($name, 'scope') || str_contains($body, '#[Scope]');

    return match (true) {
        in_array($name, ['casts', 'boot', 'booted'], true) => 'Constructors',
        $isScope => 'Scopes',
        isAccessor($method) => 'Accessors',
        in_array($returns, RELATIONS, true) => 'Relations',
        ! $method->isPublic() => 'Internals',
        $method->isStatic() && preg_match(ROW_MAKES, $body) === 1 => 'Constructors',
        $method->isStatic() => 'Queries',
        $returns === 'void' || preg_match(ROW_WRITES, $body) === 1 => 'Mutations',
        default => 'Answers',
    };
}

/**
 * The offset where a method's text starts: its first comment, or the method itself.
 */
function startOf(ClassMethod $method): int
{
    $comments = $method->getComments();

    return $comments === [] ? $method->getStartFilePos() : $comments[0]->getStartFilePos();
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
 * The faults of a model's sections as "line<TAB>fault".
 *
 * @return list<string>
 */
function faultsOf(string $source, Class_ $class): array
{
    return sectionFaults($source, $class, SECTIONS, function (ClassMethod $method, string|null $section): string|null {
        $name = $method->name->toString();

        if ($section === null) {
            return "method {$name} is outside a section";
        }

        if (isAccessor($method) === ($section === 'Accessors')) {
            return null;
        }

        return isAccessor($method)
            ? "accessor {$name} sits in {$section}, not in Accessors"
            : "method {$name} is no accessor, so it does not belong in Accessors";
    });
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
        if ($offset < startOf($method) && in_array($name, SECTIONS, true) && $name !== 'Accessors') {
            $current = $name;
        }
    }

    return $current;
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
    $marked = markedSections($source);

    foreach ($methods as $method) {
        $body = substr($source, startOf($method), $method->getEndFilePos() + 1 - startOf($method));
        $section = isAccessor($method) ? 'Accessors' : currentSectionOf($marked, $method) ?? sectionOf($method, $body);
        $sections[$section][] = textOf($source, $method);
    }

    $parts = [];

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
                new NodeFinder()->findInstanceOf($parser->parse($source) ?? [], Class_::class),
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

    return $faultCount === 0 ? 0 : 1;
}

// Run as a command, not when another tool loads these functions.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    exit(runModelSections($argv));
}
