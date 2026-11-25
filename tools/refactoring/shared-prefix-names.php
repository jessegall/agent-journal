<?php

declare(strict_types=1);

/**
 * Lists the parameters whose leading word adds nothing: $profileKey and $profileRevision in a method where
 * no other name is $key or $revision become $key and $revision. A name is flagged when dropping its leading word
 * gives a name no other parameter or variable of the method has, no other name of the method shortens to, and the
 * context already says the word: the class or method names it, or every parameter shares it. A prefix that tells two
 * values apart ($agentId beside $sessionId) stays. Controllers, whose parameters a route binds
 * by name, and generated classes are left alone.
 *
 *   php tools/refactoring/shared-prefix-names.php app domain
 *       prints "file:line<TAB>Class::method<TAB>$old<TAB>$new" for every finding and fails while there is one.
 *   php tools/refactoring/shared-prefix-names.php --fix app domain
 *       renames each finding inside its method, its variables and its @param line included. Named arguments at
 *       call sites are not changed: PHPStan names any that still use the old name.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/php-parse.php';

/**
 * Short names too bare to stand alone: the leading word is what says whose they are.
 */
const BARE_NAMES = [
    'id',
    'of',
    'ms',
    'parse',
    'key',
    'at',
    'by',
    'to',
    'is',
    'has',
    'value',
    'name',
    'type',
    'data',
    'text',
];

/**
 * The words a yes or no answer opens with: the names rule wants them kept, so they are never dropped.
 */
const QUESTION_WORDS = [
    'is',
    'has',
    'can',
    'should',
    'was',
    'were',
    'does',
    'did',
    'will',
    'allows',
];

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

/**
 * The name with its leading camelCase word dropped, or null when it has only one word.
 */
function shortened(string $name): string|null
{
    if (preg_match('/^[a-z]+([A-Z][A-Za-z0-9]*)$/', $name, $match) !== 1) {
        return null;
    }

    return lcfirst($match[1]);
}

/**
 * The leading camelCase word of a name.
 */
function leadingWord(string $name): string
{
    preg_match('/^[a-z]+/', $name, $match);

    return $match[0] ?? '';
}

/**
 * Whether the context already says the leading word: the class or the method names it, or every parameter of the
 * method shares it, as $profileKey and $profileRevision do.
 *
 * @param  list<string>  $parameters
 */
function contextSays(string $word, string $class, string $method, array $parameters): bool
{
    if (stripos($class, $word) !== false || stripos($method, $word) !== false) {
        return true;
    }

    return count($parameters) > 1
        && array_all($parameters, fn (string $parameter) => leadingWord($parameter) === $word && $parameter !== $word);
}

/**
 * Every parameter and variable name the method uses.
 *
 * @return list<string>
 */
function namesIn(ClassMethod $method): array
{
    $names = array_map(fn (Node\Param $param) => (string) $param->var->name, $method->getParams());
    $variables = new NodeFinder()->find((array) $method->getStmts(), fn (Node $node) => $node instanceof Variable);

    foreach ($variables as $variable) {
        if (is_string($variable->name)) {
            $names[] = $variable->name;
        }
    }

    return array_values(array_unique($names));
}

/**
 * Renames one variable inside one method of the source: every use of it there and its @param line.
 *
 * @return list<array{int, int, string}> replacements as start offset, end offset and new text
 */
function renamesIn(ClassMethod $method, string $old, string $new): array
{
    $replacements = [];
    $variables = new NodeFinder()->find(
        [
            ...$method->getParams(),
            ...(array) $method->getStmts(),
        ],
        fn (Node $node) => $node instanceof Variable && $node->name === $old,
    );

    foreach ($variables as $variable) {
        $replacements[] = [
            $variable->getStartFilePos(),
            $variable->getEndFilePos(),
            '$'.$new,
        ];
    }

    $doc = $method->getDocComment();

    if ($doc !== null) {
        $text = $doc->getText();
        $renamed = (string) preg_replace('/\$'.$old.'\b/', '$'.$new, $text);

        if ($renamed !== $text) {
            $replacements[] = [
                $doc->getStartFilePos(),
                $doc->getEndFilePos(),
                $renamed,
            ];
        }
    }

    return $replacements;
}

$parser = new ParserFactory()->createForNewestSupportedVersion();
$findings = 0;
$fix = in_array('--fix', $argv, true);

foreach (array_values(array_diff(array_slice($argv, 1), ['--fix'])) as $path) {
    foreach (phpFiles($path) as $file) {
        $source = (string) file_get_contents($file);
        $tree = parsedOnce($parser, $file, $source);
        $replacements = [];

        foreach (new NodeFinder()->findInstanceOf($tree, ClassLike::class) as $class) {
            $isGenerated = str_contains((string) $class->getDocComment()?->getText(), 'generated by');

            if ($isGenerated || str_ends_with($class->name?->toString() ?? '', 'Controller')) {
                continue;
            }

            foreach ($class->getMethods() as $method) {
                if ($method->stmts === null || $method->name->toString() === '__construct') {
                    continue;
                }

                $names = namesIn($method);
                $parameters = array_map(fn (Node\Param $param) => (string) $param->var->name, $method->getParams());
                $className = $class->name?->toString() ?? '';
                $shortenings = array_count_values(array_filter(array_map(shortened(...), $names)));

                foreach ($method->getParams() as $param) {
                    $name = (string) $param->var->name;
                    $short = shortened($name);
                    $isAmbiguous = $short === null || in_array($short, BARE_NAMES, true)
                        || in_array(leadingWord($name), QUESTION_WORDS, true)
                        || in_array($short, $names, true) || $shortenings[$short] > 1
                        || ! contextSays(leadingWord($name), $className, $method->name->toString(), $parameters);

                    if ($isAmbiguous) {
                        continue;
                    }

                    $findings++;
                    $replacements = [...$replacements, ...renamesIn($method, $name, $short)];
                    printf(
                        "%s:%d\t%s::%s\t\$%s\t\$%s\n",
                        $file,
                        $param->getStartLine(),
                        $class->name?->toString() ?? 'class',
                        $method->name->toString(),
                        $name,
                        $short,
                    );
                }
            }
        }

        if ($fix && $replacements !== []) {
            usort($replacements, fn (array $first, array $second) => $second[0] <=> $first[0]);

            foreach ($replacements as [$start, $end, $text]) {
                $source = substr($source, 0, $start).$text.substr($source, $end + 1);
            }

            file_put_contents($file, $source);
        }
    }
}

exit($findings === 0 || $fix ? 0 : 1);
