<?php

declare(strict_types=1);

/**
 * Lists every name the code declares, one per line as "type<TAB>name<TAB>file:line", so the names can be read and
 * judged together: classes, interfaces, traits and enums, and their methods, properties, constants and enum cases.
 *
 *   php tools/refactoring/list-names.php app tests/Architecture/Support
 *       prints every name.
 *   php tools/refactoring/list-names.php --check docs/naming/reviewed-names.txt app tests/Architecture/Support
 *       prints the names not on the reviewed list and fails while there is one.
 *   php tools/refactoring/list-names.php --accept docs/naming/reviewed-names.txt app tests/Architecture/Support
 *       writes every current name to the reviewed list, after they were read and the unclear ones renamed.
 */

use PhpParser\Node;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\Node\Stmt\EnumCase;
use PhpParser\Node\Stmt\Interface_;
use PhpParser\Node\Stmt\Property;
use PhpParser\Node\Stmt\Trait_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\ParserFactory;

require dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/promoted-parameters.php';

/**
 * One name the code declares: what kind of thing it names, the name, and where it is declared.
 */
final readonly class DeclaredName
{
    public function __construct(
        public string $kind,
        public string $name,
        public string $place,
    ) {}

    /**
     * The name as the review file keeps it, without its place: `kind<TAB>Name`.
     */
    public function reviewLine(): string
    {
        return "{$this->kind}\t{$this->name}";
    }
}

$arguments = array_slice($argv, 1);
$mode = in_array($arguments[0] ?? null, ['--check', '--accept'], true) ? array_shift($arguments) : '--list';
$reviewedFile = $mode === '--list' ? '' : (string) array_shift($arguments);
$names = declaredNames($arguments);

if ($mode === '--list') {
    foreach ($names as $declared) {
        echo "{$declared->reviewLine()}\t{$declared->place}\n";
    }

    exit(0);
}

$current = array_values(array_unique(array_map(fn (DeclaredName $declared) => $declared->reviewLine(), $names)));
sort($current);

if ($mode === '--accept') {
    file_put_contents($reviewedFile, implode("\n", $current)."\n");
    echo count($current)." names recorded as reviewed in {$reviewedFile}\n";

    exit(0);
}

$reviewed = is_file($reviewedFile) ? file($reviewedFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$unreviewed = array_values(array_diff($current, $reviewed ?: []));

if ($unreviewed === []) {
    echo 'All '.count($current)." declared names were reviewed.\n";

    exit(0);
}

echo count($unreviewed)." declared names were not reviewed yet; read each, rename what is not plain programming English, then record them with --accept:\n";

foreach ($names as $declared) {
    if (in_array($declared->reviewLine(), $unreviewed, true)) {
        echo "  {$declared->kind} {$declared->name} ({$declared->place})\n";
    }
}

exit(1);

/**
 * @param  list<string>  $folders
 * @return list<DeclaredName>
 */
function declaredNames(array $folders): array
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $names = [];

    foreach ($folders as $folder) {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS));

        foreach ($files as $file) {
            if (! $file instanceof SplFileInfo || $file->getExtension() !== 'php') {
                continue;
            }

            $path = $file->getPathname();
            $statements = new NodeTraverser(new NameResolver())->traverse($parser->parse((string) file_get_contents($path)) ?? []);

            foreach (new NodeFinder()->findInstanceOf($statements, ClassLike::class) as $type) {
                if ($type->name === null) {
                    continue;
                }

                $typeName = $type->name->toString();
                $names[] = new DeclaredName(declarationTypeOf($type), $typeName, "{$path}:{$type->getStartLine()}");

                foreach ($type->stmts as $member) {
                    foreach (membersOf($member) as [$declarationType, $name]) {
                        $names[] = new DeclaredName(
                            $declarationType,
                            "{$typeName}::{$name}",
                            "{$path}:{$member->getStartLine()}",
                        );
                    }
                }
            }

            array_push($names, ...localNamesOf($statements, $path));
        }
    }

    return $names;
}

/**
 * Every parameter and local variable a file names, each as `$name`: a parameter of any function, method or closure,
 * and a variable that is not one of them, `$this` or a superglobal. A name counts once however often it is used.
 *
 * @param  array<Node>  $statements
 * @return list<DeclaredName>
 */
function localNamesOf(array $statements, string $path): array
{
    $finder = new NodeFinder();
    $parameters = [];

    foreach ($finder->findInstanceOf($statements, Node\Param::class) as $parameter) {
        if ($parameter->var instanceof Node\Expr\Variable && is_string($parameter->var->name)) {
            $parameters['$'.$parameter->var->name] ??= $parameter->getStartLine();
        }
    }

    $variables = [];
    $ignored = ['this', 'GLOBALS', '_SERVER', '_GET', '_POST', '_FILES', '_COOKIE', '_SESSION', '_REQUEST', '_ENV', 'argv', 'argc'];

    foreach ($finder->findInstanceOf($statements, Node\Expr\Variable::class) as $variable) {
        $name = $variable->name;

        if (! is_string($name) || in_array($name, $ignored, true) || isset($parameters['$'.$name])) {
            continue;
        }

        $variables['$'.$name] ??= $variable->getStartLine();
    }

    return [
        ...array_map(
            fn (string $name, int $line) => new DeclaredName('parameter', $name, "{$path}:{$line}"),
            array_keys($parameters),
            $parameters,
        ),
        ...array_map(
            fn (string $name, int $line) => new DeclaredName('variable', $name, "{$path}:{$line}"),
            array_keys($variables),
            $variables,
        ),
    ];
}

function declarationTypeOf(ClassLike $type): string
{
    return match (true) {
        $type instanceof Interface_ => 'interface',
        $type instanceof Trait_ => 'trait',
        $type instanceof Enum_ => 'enum',
        $type instanceof Class_ => 'class',
        default => 'type',
    };
}

/**
 * @return list<array{string, string}>
 */
function membersOf(Node $member): array
{
    return match (true) {
        $member instanceof ClassMethod => [['method', $member->name->toString().'()'], ...promotedProperties($member)],
        $member instanceof Property => array_map(fn ($property) => ['property', '$'.$property->name->toString()], $member->props),
        $member instanceof ClassConst => array_map(fn ($constant) => ['constant', $constant->name->toString()], $member->consts),
        $member instanceof EnumCase => [['case', $member->name->toString()]],
        default => [],
    };
}

/**
 * @return list<array{string, string}>
 */
function promotedProperties(ClassMethod $method): array
{
    $properties = [];

    foreach ($method->params as $param) {
        if (isPromoted($param)) {
            $properties[] = ['property', '$'.$param->var->name];
        }
    }

    return $properties;
}
