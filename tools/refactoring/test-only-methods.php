<?php

declare(strict_types=1);

/**
 * Finds a public method of an Eloquent model that only tests call: no file of the application names it, while a test
 * does. Such a method is how a second copy of a model's behaviour survives beside the one the application uses.
 *
 *   php tools/refactoring/test-only-methods.php
 *       prints "file:line<TAB>Model::method" for each such method and fails while there is one that
 *       docs/naming/test-only-model-methods.txt does not list yet; that list holds the methods already known, each
 *       waiting for its own decision, so only a new one fails.
 *
 * A method counts as used when the application calls it (->name, ::name or ?->name), names it as a string (a
 * relation in with() or whereHas(), a callable), reads it as a relation property, or calls it as a scope; methods
 * Laravel's Model already declares are left out, as the framework calls them.
 */

use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';
require __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

const APPLICATION = [
    'app',
    'routes',
    'config',
    'resources',
    'bootstrap',
    'database',
];

const TESTS = ['tests'];

/**
 * The text of every PHP file under the folders, one string.
 *
 * @param  list<string>  $folders
 */
function corpusOf(string $root, array $folders): string
{
    $text = '';

    foreach ($folders as $folder) {
        if (! file_exists("{$root}/{$folder}")) {
            continue;
        }

        foreach (phpFiles("{$root}/{$folder}") as $file) {
            $text .= (string) file_get_contents($file)."\n";
        }
    }

    return $text;
}

/**
 * Whether the text calls, names or reads the method.
 */
function names(string $text, string $method): bool
{
    $name = preg_quote($method, '/');
    $plain = (string) preg_replace('/^scope/', '', $method);
    $scope = preg_quote(lcfirst($plain), '/');

    return preg_match("/(->|::|\\?->)({$name}|{$scope})\\b|['\"]{$name}['\"]/", $text) === 1;
}

$domains = glob("{$root}/domain/*") ?: [];
$domainCode = array_map(fn (string $path) => substr($path, strlen($root) + 1).'/src', $domains);
$domainTests = array_map(fn (string $path) => substr($path, strlen($root) + 1).'/tests', $domains);
$domainDatabase = array_map(fn (string $path) => substr($path, strlen($root) + 1).'/database', $domains);
$application = corpusOf($root, [
    ...APPLICATION,
    ...$domainCode,
    ...$domainDatabase,
]);
$tests = corpusOf($root, [
    ...TESTS,
    ...$domainTests,
]);
$parser = new ParserFactory()->createForNewestSupportedVersion();
$knownFile = "{$root}/docs/naming/test-only-model-methods.txt";
$known = is_file($knownFile) ? array_filter(array_map(trim(...), file($knownFile) ?: [])) : [];
$found = 0;

foreach ([
    'app',
    ...$domainCode,
] as $folder) {
    foreach (phpFiles("{$root}/{$folder}") as $file) {
        $statements = parsedOnce($parser, $file, (string) file_get_contents($file));

        foreach (new NodeFinder()->findInstanceOf($statements, Class_::class) as $class) {
            if (! isModel($class)) {
                continue;
            }

            foreach ($class->getMethods() as $method) {
                $name = $method->name->toString();

                if (! $method->isPublic()
                    || str_starts_with($name, '__')
                    || Reflector::of(Model::class)->hasMethod($name)) {
                    continue;
                }

                if (! names($application, $name) && names($tests, $name)
                    && ! in_array("{$class->name}::{$name}", $known, true)) {
                    $found++;
                    $relative = substr($file, strlen($root) + 1);
                    echo "{$relative}:{$method->getStartLine()}\t{$class->name}::{$name}\n";
                }
            }
        }
    }
}

exit($found === 0 ? 0 : 1);
