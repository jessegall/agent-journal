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
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/model-sections.php';

/** What an accessor's closure, or an answer that may become one, must never do. */
const SIDE_EFFECTS = '/->(save|update|delete|forceDelete|increment|decrement|forceFill|fill|touch|push|restore)\(|'
    .'\bdispatch\(|\bevent\(|->dispatch\(|->run\(|file_get_contents|file_put_contents|Process::/';

/** What a body does when it reads rows, which an accessor never does, so such an answer stays a method. */
const ROW_READS = '/::query\(|->query\(|\b(self|static)::\w*[wW]here|DB::|->load(Missing|Count)?\(|'
    .'\$this->\w+\(\)->(where|get|first|sole|count|exists|pluck|latest|oldest|orderBy|find)\w*\(/';

/** The return types an answer keeps as a method: a question, nothing, or the model itself. */
const METHOD_RETURNS = ['bool', 'void', 'never', 'static', 'self', 'Attribute', 'Builder'];

/** The return types whose value PHP passes as a copy, so an accessor of one needs no object caching turned off. */
const COPIED_RETURNS = ['string', 'int', 'float', 'array', 'null'];

/**
 * Whether a parent, an interface or a trait of the model declares the method too, so the method answers a contract.
 */
function answersAContract(string $class, string $method): bool
{
    $type = Reflector::of($class);
    $others = [...array_slice($type->lineage(), 1), ...$type->interfaces(), ...$type->allTraits()];

    return array_any($others, fn (Reflector $other) => $other->hasMethod($method));
}

/**
 * Whether the method reads rows: itself, through a static method of another model, or through a method of its own
 * model that does.
 *
 * @param  list<string>  $followed  the methods of the model already followed, so a loop of calls ends
 */
function readsRows(string $source, string $class, ClassMethod $method, array $followed): bool
{
    $body = substr($source, $method->getStartFilePos(), $method->getEndFilePos() + 1 - $method->getStartFilePos());

    if (preg_match(ROW_READS, $body) === 1) {
        return true;
    }

    $finder = new NodeFinder();

    foreach ($finder->findInstanceOf($method, Node\Expr\StaticCall::class) as $call) {
        $called = $call->class instanceof Node\Name ? importedName($source, $call->class->toString()) : '';

        if ($called !== $class && Reflector::exists($called) && Reflector::of($called)->isSubclassOf(Model::class)) {
            return true;
        }
    }

    $model = Reflector::of($class);

    foreach ($finder->findInstanceOf($method, Node\Expr\MethodCall::class) as $call) {
        $name = $call->name instanceof Node\Identifier ? $call->name->toString() : '';
        $isOwn = $call->var instanceof Node\Expr\Variable && $call->var->name === 'this';

        if (! $isOwn || in_array($name, $followed, true) || ! $model->hasMethod($name)) {
            continue;
        }

        $own = ownMethodNamed($source, $name);

        if ($own !== null && readsRows($source, $class, $own, [...$followed, $method->name->toString()])) {
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

    if (preg_match('/^use ([\w\\\\]+\\\\'.preg_quote($short, '/').');/m', $source, $imported) === 1) {
        return $imported[1].substr($name, strlen($short));
    }

    preg_match('/^namespace\s+([^;]+);/m', $source, $namespace);

    return $namespace[1].'\\'.$name;
}

/**
 * The method of the source's model with this name, none when a trait or a parent declares it.
 */
function ownMethodNamed(string $source, string $name): ClassMethod|null
{
    $parsed = new ParserFactory()->createForNewestSupportedVersion()->parse($source) ?? [];
    $methods = new NodeFinder()->find($parsed, fn (Node $node) => $node instanceof ClassMethod && $node->name->toString() === $name);

    return $methods[0] ?? null;
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
 * Whether a model method takes nothing, changes nothing and answers with more than yes or no, so it is an accessor;
 * one that names what it throws keeps it in a method's contract, which a property read cannot carry.
 */
function belongsInAccessor(string $source, string $class, ClassMethod $method): bool
{
    $returns = $method->returnType;
    $returned = $returns instanceof Node\Identifier || $returns instanceof Node\Name ? $returns->toString() : '';
    $body = substr($source, startOf($method), $method->getEndFilePos() + 1 - startOf($method));

    return $method->isPublic()
        && ! $method->isStatic()
        && ! $method->isAbstract()
        && $method->params === []
        && ! in_array($returned, METHOD_RETURNS, true)
        && ! str_starts_with($method->name->toString(), '__')
        && sectionOf($method, $body) === 'Answers'
        && preg_match(SIDE_EFFECTS, $body) !== 1
        && ! readsRows($source, $class, $method, [])
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
            $faults[] = "{$method->getStartLine()}\taccessor {$name} writes, dispatches or runs something";
        }

        if (isAccessor($method) && readsRows($source, $class, $method, [])) {
            $faults[] = "{$method->getStartLine()}\taccessor {$name} reads rows";
        }

        if (belongsInAccessor($source, $class, $method)) {
            $faults[] = "{$method->getStartLine()}\tanswer {$name} takes nothing and returns no bool, so it is an accessor";
        }
    }

    return $faults;
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
 * The method's body as the closure the accessor hands to Attribute::get.
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
 * The method rewritten as a protected accessor, its object results computed afresh on every read.
 */
function accessorOf(string $source, ClassMethod $method): string
{
    $returned = returnedTypeOf($source, $method);
    $declared = substr(
        $source,
        $method->returnType->getStartFilePos(),
        $method->returnType->getEndFilePos() + 1 - $method->returnType->getStartFilePos(),
    );
    $isCopied = array_all(
        explode('|', ltrim($declared, '?')),
        fn (string $part) => in_array($part, COPIED_RETURNS, true),
    );
    $caching = $isCopied ? '' : '->withoutObjectCaching()';

    return accessorDocOf($method, $returned)
        ."    protected function {$method->name->toString()}(): Attribute\n    {\n"
        .'        return Attribute::get('.accessorClosureOf($source, $method).")$caching;\n    }";
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
        fn (ClassMethod $method) => belongsInAccessor($source, $class, $method)
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

$parser = new ParserFactory()->createForNewestSupportedVersion();
$fix = in_array('--fix', $argv, true);
$keptOption = array_values(preg_grep('/^--keep=/', $argv) ?: []);
$kept = $keptOption === [] ? [] : explode(',', substr($keptOption[0], strlen('--keep=')));
$faultCount = 0;

foreach (array_values(array_diff(array_slice($argv, 1), ['--fix', ...$keptOption])) as $path) {
    foreach (phpFiles($path) as $file) {
        $source = (string) file_get_contents($file);
        $models = array_filter(
            new NodeFinder()->findInstanceOf($parser->parse($source) ?? [], Class_::class),
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
