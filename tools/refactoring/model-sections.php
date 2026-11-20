<?php

declare(strict_types=1);

/**
 * Checks that every Eloquent model's methods sit in marked sections (rule 50), and sorts them into sections.
 *
 *   php tools/refactoring/model-sections.php app domain
 *       prints "file:line<TAB>what is wrong" for a method outside a section, an unknown section name, a section out
 *       of order or a section written twice, and fails while there is one.
 *   php tools/refactoring/model-sections.php --fix app domain
 *       moves each model's methods into their sections, in the rule's order, keeping each method's text whole.
 */

use PhpParser\Node;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require dirname(__DIR__, 2).'/vendor/autoload.php';

const SECTIONS = ['Constructors', 'Queries', 'Mutations', 'Answers', 'Relations', 'Internals', 'Scopes'];

const MODEL_PARENTS = ['Model', 'Pivot', 'MorphPivot', 'Authenticatable', 'PackagePasskey'];

const RELATIONS = [
    'BelongsTo', 'BelongsToMany', 'HasMany', 'HasOne', 'HasManyThrough', 'HasOneThrough', 'MorphTo', 'MorphMany',
    'MorphOne', 'MorphToMany', 'MorphedByMany',
];

const MARKER = '/^\s*\/\/ -+\[ (\w+) \]-+\s*$/';

const ROW_WRITES = '/->(save|update|delete|forceDelete|increment|decrement|forceFill|fill|touch|push|restore)\(/';

const ROW_MAKES = '/(self|static)::(create|forceCreate|firstOrCreate|updateOrCreate|insert)\(|->(save|create)\(|new (self|static)\b/';

/**
 * @return list<string>
 */
function phpFiles(string $path): array
{
    if (is_file($path)) {
        return [$path];
    }

    $files = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));

    foreach ($iterator as $file) {
        if ($file->getExtension() === 'php') {
            $files[] = $file->getPathname();
        }
    }

    sort($files);

    return $files;
}

function isModel(Class_ $class): bool
{
    return $class->extends !== null && in_array($class->extends->getLast(), MODEL_PARENTS, true);
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
    $faults = [];
    $lines = explode("\n", $source);
    $seen = [];
    $section = null;
    $line = $class->getStartLine();
    $methods = [];

    foreach ($class->getMethods() as $method) {
        $methods[$method->getStartLine()] = $method->name->toString();
    }

    for (; $line <= $class->getEndLine(); $line++) {
        if (preg_match(MARKER, $lines[$line - 1], $match) === 1) {
            $name = $match[1];
            $place = array_search($name, SECTIONS, true);

            if ($place === false) {
                $faults[] = "{$line}\tunknown section {$name}";
            } elseif (in_array($name, $seen, true)) {
                $faults[] = "{$line}\tsection {$name} written twice";
            } elseif ($seen !== [] && $place < array_search(end($seen), SECTIONS, true)) {
                $faults[] = "{$line}\tsection {$name} comes before ".end($seen);
            }

            $seen[] = $name;
            $section = $name;
        }

        if (isset($methods[$line]) && $section === null) {
            $faults[] = "{$line}\tmethod {$methods[$line]} is outside a section";
        }
    }

    return $faults;
}

/**
 * The model's source with its methods sorted into sections.
 */
function sorted(string $source, Class_ $class): string
{
    $methods = $class->getMethods();

    if ($methods === []) {
        return $source;
    }

    foreach ($class->stmts as $member) {
        if (! $member instanceof ClassMethod && $member->getStartLine() > $methods[0]->getStartLine()) {
            throw new RuntimeException("A member below the first method stays put; move it up: line {$member->getStartLine()}");
        }
    }

    $sections = array_fill_keys(SECTIONS, []);

    foreach ($methods as $method) {
        $body = substr($source, startOf($method), $method->getEndFilePos() + 1 - startOf($method));
        $sections[sectionOf($method, $body)][] = textOf($source, $method);
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

$parser = new ParserFactory()->createForNewestSupportedVersion();
$fix = in_array('--fix', $argv, true);
$faultCount = 0;

foreach (array_values(array_diff(array_slice($argv, 1), ['--fix'])) as $path) {
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

exit($faultCount === 0 ? 0 : 1);
