<?php

declare(strict_types=1);

/**
 * Rename a method, a property or a constant of a class with every reference to it, or a variable within a folder.
 *
 *   php tools/refactoring/rename-member.php method   App\\Core\\Actors\\Support\\ActorIdentity isSameAs matches
 *   php tools/refactoring/rename-member.php property App\\Core\\Actors\\Support\\ActorIdentity kind type
 *   php tools/refactoring/rename-member.php constant App\\Core\\Web\\Pages\\LoginPage COMPONENT PAGE
 *   php tools/refactoring/rename-member.php variable app/Core/Assignments kind type
 *   php tools/refactoring/rename-member.php --list=tools/refactoring/members.txt
 *   php tools/refactoring/rename-member.php ... --dry-run
 *   php tools/refactoring/rename-member.php --test
 *
 * A member is renamed in the class, in every project class, interface and trait it is related to by extends,
 * implements or use (an override keeps its parent's name), and at every call, access, constant fetch and named
 * argument. Instance calls and accesses are found by name, because their receiver's class is not always written, so
 * the rename is refused when another unrelated project class declares a member of the same name: name it with
 * --with=App\\Other\\Class to rename it as well. A variable is renamed wherever it is used in the PHP files under the
 * folder, including closure uses and @param lines. Strings that spell the old name are listed for checking by hand,
 * never changed. A list file holds one rename per line in the same words; blank lines and # lines are skipped.
 */

require dirname(__DIR__, 2).'/vendor/autoload.php';

use PhpParser\Comment\Doc;
use PhpParser\Node;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitorAbstract;
use PhpParser\ParserFactory;

/**
 * Marks each method, property and constant declaration with the full name of the type it is declared in.
 */
final class DeclaringTypeMarker extends NodeVisitorAbstract
{
    /**
     * @var list<string>
     */
    private array $types = [];

    public function enterNode(Node $node): null
    {
        if ($node instanceof Node\Stmt\ClassLike) {
            $this->types[] = $node->namespacedName?->toString() ?? '';
        }

        if ($this->types !== [] && ($node instanceof Node\Stmt\ClassMethod || $node instanceof Node\PropertyItem || $node instanceof Node\Const_)) {
            $node->setAttribute('declaringType', end($this->types));
        }

        return null;
    }

    public function leaveNode(Node $node): null
    {
        if ($node instanceof Node\Stmt\ClassLike) {
            array_pop($this->types);
        }

        return null;
    }
}

const SEARCHED = ['app', 'domain', 'tests', 'routes', 'bootstrap', 'config', 'database'];
const SKIPPED = ['vendor', 'node_modules'];

$arguments = array_slice($argv, 1);

if (in_array('--test', $arguments, true)) {
    exit(selfTest());
}

$dry = in_array('--dry-run', $arguments, true);
$root = dirname(__DIR__, 2);
$with = [];
$renames = [];
$words = [];

foreach ($arguments as $argument) {
    match (true) {
        $argument === '--dry-run' => null,
        str_starts_with($argument, '--root=') => $root = rtrim(substr($argument, 7), '/'),
        str_starts_with($argument, '--with=') => $with = [...$with, ...array_map(static fn (string $name) => ltrim($name, '\\'), explode(',', substr($argument, 7)))],
        str_starts_with($argument, '--list=') => $renames = [...$renames, ...listedRenames(substr($argument, 7))],
        default => $words[] = $argument,
    };
}

if ($words !== []) {
    $renames[] = $words;
}

if ($renames === []) {
    fwrite(STDERR, "Usage: rename-member.php method|property|constant <class> <old> <new> | variable <folder> <old> <new> [--with=<class>] [--dry-run]\n");
    exit(2);
}

$failed = 0;

foreach ($renames as $rename) {
    try {
        $changes = renameMember($root, $rename, $with, $dry);
        printf("%s %s: %d change(s) in %d file(s)\n", $dry ? 'Would rename' : 'Renamed', implode(' ', $rename), array_sum(array_map('count', $changes['edits'])), count($changes['edits']));

        foreach ($changes['edits'] as $file => $edits) {
            printf("  %s: %d\n", $file, count($edits));
        }

        foreach ($changes['strings'] as $line) {
            printf("  check by hand, a string spells the old name: %s\n", $line);
        }
    } catch (RuntimeException $refusal) {
        $failed++;
        fwrite(STDERR, 'Refused '.implode(' ', $rename).': '.$refusal->getMessage()."\n");
    }

    // the parsed files hold parent links in cycles, which only a collection frees before the next rename parses again
    gc_collect_cycles();
}

exit($failed > 0 ? 1 : 0);

/**
 * @return list<list<string>>
 */
function listedRenames(string $path): array
{
    $lines = array_map('trim', file($path, FILE_IGNORE_NEW_LINES) ?: []);

    return array_values(array_map(
        static fn (string $line): array => preg_split('/\s+/', $line) ?: [],
        array_filter($lines, static fn (string $line): bool => $line !== '' && ! str_starts_with($line, '#')),
    ));
}

/**
 * Renames one member or variable and returns what it changed: the edits per file and the strings left to check.
 *
 * @param  list<string>  $rename  the member kind word, the class or folder, the old name and the new name
 * @param  list<string>  $with  other classes whose member of the same name is renamed as well
 * @return array{edits: array<string, list<array{int, int, string}>>, strings: list<string>}
 */
function renameMember(string $root, array $rename, array $with, bool $dry): array
{
    [$what, $owner, $old, $new] = array_pad($rename, 4, '');

    if (! in_array($what, ['method', 'property', 'constant', 'variable'], true) || $owner === '' || $old === '' || $new === '') {
        throw new RuntimeException('a rename is: method|property|constant <class> <old> <new>, or variable <folder> <old> <new>');
    }

    $files = parsedFiles($root, $what === 'variable' ? [$owner] : SEARCHED);
    $edits = $what === 'variable'
        ? variableEdits($files, $old, $new)
        : memberEdits($files, $what, ltrim($owner, '\\'), $old, $new, $with);

    if (! $dry) {
        foreach ($edits as $file => $fileEdits) {
            file_put_contents($root.'/'.$file, applied($files[$file]['code'], $fileEdits));
        }
    }

    return ['edits' => $edits, 'strings' => stringsSpelling($files, $old)];
}

/**
 * Every PHP file under the folders, parsed with names resolved.
 *
 * @param  list<string>  $folders
 * @return array<string, array{code: string, statements: list<Node>}>
 */
function parsedFiles(string $root, array $folders): array
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $files = [];

    foreach ($folders as $folder) {
        $path = $root.'/'.$folder;

        if (! is_dir($path)) {
            continue;
        }

        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $file) {
            $name = $file->getPathname();

            if ($file->getExtension() !== 'php' || array_filter(SKIPPED, static fn (string $skip): bool => str_contains($name, '/'.$skip.'/')) !== []) {
                continue;
            }

            $code = (string) file_get_contents($name);
            $statements = $parser->parse($code) ?? [];
            $traverser = new NodeTraverser(new NameResolver(), new DeclaringTypeMarker());
            $files[substr($name, strlen($root) + 1)] = ['code' => $code, 'statements' => $traverser->traverse($statements)];
        }
    }

    ksort($files);

    return $files;
}

/**
 * The project's classes, interfaces and traits, each with the types it is related to and the members it declares.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @return array<string, array{related: list<string>, method: list<string>, property: list<string>, constant: list<string>}>
 */
function typeIndex(array $files): array
{
    $index = [];
    $finder = new NodeFinder();

    foreach ($files as $file) {
        foreach ($finder->findInstanceOf($file['statements'], Node\Stmt\ClassLike::class) as $type) {
            if ($type->namespacedName === null) {
                continue;
            }

            $related = [];

            if ($type instanceof Node\Stmt\Class_) {
                $related = [...($type->extends !== null ? [$type->extends->toString()] : []), ...array_map(static fn (Node\Name $name) => $name->toString(), $type->implements)];
            }

            if ($type instanceof Node\Stmt\Interface_) {
                $related = array_map(static fn (Node\Name $name) => $name->toString(), $type->extends);
            }

            foreach ($type->getTraitUses() as $use) {
                array_push($related, ...array_map(static fn (Node\Name $name) => $name->toString(), $use->traits));
            }

            $properties = [];

            foreach ($type->getProperties() as $property) {
                array_push($properties, ...array_map(static fn (Node\PropertyItem $item) => $item->name->toString(), $property->props));
            }

            foreach ($type->getMethod('__construct')?->params ?? [] as $param) {
                if ($param->flags !== 0 && $param->var instanceof Node\Expr\Variable && is_string($param->var->name)) {
                    $properties[] = $param->var->name;
                }
            }

            $constants = [];

            foreach ($type->getConstants() as $constant) {
                array_push($constants, ...array_map(static fn (Node\Const_ $const) => $const->name->toString(), $constant->consts));
            }

            $index[$type->namespacedName->toString()] = [
                'related' => $related,
                'method' => array_map(static fn (Node\Stmt\ClassMethod $method) => $method->name->toString(), $type->getMethods()),
                'property' => $properties,
                'constant' => $constants,
            ];
        }
    }

    return $index;
}

/**
 * The class and every project type joined to it by extends, implements or use, in either direction.
 *
 * @param  array<string, array{related: list<string>}>  $index
 * @return list<string>
 */
function familyOf(array $index, string $class): array
{
    $family = [$class];

    for ($at = 0; $at < count($family); $at++) {
        $type = $family[$at];
        $neighbours = [...array_values(array_intersect($index[$type]['related'] ?? [], array_keys($index)))];

        foreach ($index as $other => $entry) {
            if (in_array($type, $entry['related'], true)) {
                $neighbours[] = $other;
            }
        }

        foreach ($neighbours as $neighbour) {
            if (! in_array($neighbour, $family, true)) {
                $family[] = $neighbour;
            }
        }
    }

    return $family;
}

/**
 * The edits renaming a method, property or constant of the class and its family everywhere it is named.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @param  list<string>  $with
 * @return array<string, list<array{int, int, string}>>
 */
function memberEdits(array $files, string $what, string $class, string $old, string $new, array $with): array
{
    $index = typeIndex($files);

    if (! isset($index[$class])) {
        throw new RuntimeException("{$class} is not declared in the project");
    }

    $family = [];

    foreach ([$class, ...$with] as $start) {
        foreach (familyOf($index, $start) as $member) {
            $family[$member] = true;
        }
    }

    if (! array_filter(array_keys($family), static fn (string $type) => in_array($old, $index[$type][$what], true))) {
        throw new RuntimeException("{$class} declares no {$what} {$old}");
    }

    $others = array_keys(array_filter($index, static fn (array $entry, string $type) => ! isset($family[$type]) && in_array($old, $entry[$what], true), ARRAY_FILTER_USE_BOTH));

    if ($what !== 'constant' && $others !== []) {
        throw new RuntimeException("other classes also declare a {$what} {$old}, so a call by name cannot be told apart: ".implode(', ', $others).' (rename them too with --with=...)');
    }

    foreach (array_keys($family) as $type) {
        if (in_array($new, $index[$type][$what], true)) {
            throw new RuntimeException("{$type} already declares a {$what} {$new}");
        }
    }

    $edits = [];
    $finder = new NodeFinder();

    foreach ($files as $path => $file) {
        $found = [];

        foreach ($finder->find($file['statements'], static fn (Node $node) => true) as $node) {
            array_push($found, ...memberSites($node, $what, $old, $new, $family));
        }

        if ($what === 'property') {
            array_push($found, ...promotedVariableSites($file['statements'], $old, $new, $family));
        }

        if ($found !== []) {
            $edits[$path] = $found;
        }
    }

    return $edits;
}

/**
 * The places one node names the member: its declaration in the family, an instance call or access by name, a static
 * call, access or constant of the family, and a named argument passed to a family constructor.
 *
 * @param  array<string, true>  $family
 * @return list<array{int, int, string}>
 */
function memberSites(Node $node, string $what, string $old, string $new, array $family): array
{
    $sites = [];
    $inFamily = static fn (Node|null $class): bool => $class instanceof Node\Name && (isset($family[$class->toString()]) || in_array($class->toLowerString(), ['self', 'static', 'parent'], true));

    if ($what === 'method') {
        $named = match (true) {
            $node instanceof Node\Stmt\ClassMethod => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\MethodCall, $node instanceof Node\Expr\NullsafeMethodCall => $node->name,
            $node instanceof Node\Expr\StaticCall => $inFamily($node->class) ? $node->name : null,
            default => null,
        };
    } elseif ($what === 'property') {
        $named = match (true) {
            $node instanceof Node\PropertyItem => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\PropertyFetch, $node instanceof Node\Expr\NullsafePropertyFetch => $node->name,
            $node instanceof Node\Expr\StaticPropertyFetch => $inFamily($node->class) ? $node->name : null,
            default => null,
        };

        if ($node instanceof Node\Expr\New_ && $inFamily($node->class)) {
            foreach ($node->args as $argument) {
                if ($argument instanceof Node\Arg && $argument->name?->toString() === $old) {
                    $sites[] = [$argument->name->getStartFilePos(), $argument->name->getEndFilePos(), $new];
                }
            }
        }
    } else {
        $named = match (true) {
            $node instanceof Node\Const_ => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\ClassConstFetch => $inFamily($node->class) ? $node->name : null,
            default => null,
        };
    }

    if (($named instanceof Node\Identifier || $named instanceof Node\VarLikeIdentifier) && $named->toString() === $old) {
        $sites[] = [$named->getStartFilePos(), $named->getEndFilePos(), $new];
    }

    return $sites;
}

/**
 * A promoted constructor parameter is also a variable in its constructor: its parameter, its uses there and its
 *
 * @param line follow the property.
 * @param  list<Node>  $statements
 * @param  array<string, true>  $family
 * @return list<array{int, int, string}>
 */
function promotedVariableSites(array $statements, string $old, string $new, array $family): array
{
    $sites = [];
    $finder = new NodeFinder();

    foreach ($finder->findInstanceOf($statements, Node\Stmt\ClassMethod::class) as $method) {
        if ($method->name->toLowerString() !== '__construct' || ! isset($family[declaringType($method)])) {
            continue;
        }

        $promoted = array_filter($method->params, static fn (Node\Param $param) => $param->flags !== 0 && $param->var instanceof Node\Expr\Variable && $param->var->name === $old);

        if ($promoted === []) {
            continue;
        }

        foreach ($finder->find($method, static fn (Node $node) => $node instanceof Node\Expr\Variable && $node->name === $old) as $variable) {
            $sites[] = [$variable->getStartFilePos(), $variable->getEndFilePos(), '$'.$new];
        }

        array_push($sites, ...docSites($method->getDocComment(), $old, $new));
    }

    return $sites;
}

/**
 * The edits renaming a variable in every PHP file under the folder, with its closure uses and @param lines.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @return array<string, list<array{int, int, string}>>
 */
function variableEdits(array $files, string $old, string $new): array
{
    $edits = [];
    $finder = new NodeFinder();

    foreach ($files as $path => $file) {
        $found = [];

        foreach ($finder->find($file['statements'], static fn (Node $node) => $node instanceof Node\Expr\Variable && $node->name === $old) as $variable) {
            $found[] = [$variable->getStartFilePos(), $variable->getEndFilePos(), '$'.$new];
        }

        foreach ($finder->find($file['statements'], static fn (Node $node) => $node instanceof Node\FunctionLike) as $function) {
            array_push($found, ...docSites($function->getDocComment(), $old, $new));
        }

        if ($found !== []) {
            $edits[$path] = $found;
        }
    }

    return $edits;
}

/**
 * The $old mentions of a doc comment, such as its @param line.
 *
 * @return list<array{int, int, string}>
 */
function docSites(Doc|null $doc, string $old, string $new): array
{
    if ($doc === null) {
        return [];
    }

    preg_match_all('/\$'.preg_quote($old, '/').'\b/', $doc->getText(), $matches, PREG_OFFSET_CAPTURE);

    return array_map(static fn (array $match) => [$doc->getStartFilePos() + $match[1], $doc->getStartFilePos() + $match[1] + strlen($match[0]) - 1, '$'.$new], $matches[0]);
}

/**
 * The class, interface or trait a declaration sits in, as DeclaringTypeMarker recorded it.
 */
function declaringType(Node $node): string
{
    return $node->getAttribute('declaringType') ?? '';
}

/**
 * The code with the edits made, last first so the earlier offsets still hold.
 *
 * @param  list<array{int, int, string}>  $edits
 */
function applied(string $code, array $edits): string
{
    $unique = [];

    foreach ($edits as $edit) {
        $unique[$edit[0]] = $edit;
    }

    krsort($unique);

    foreach ($unique as [$start, $end, $text]) {
        // a declared property's name spans its $, which the new name keeps
        $sigil = $code[$start] === '$' && ! str_starts_with($text, '$') ? '$' : '';
        $code = substr($code, 0, $start).$sigil.$text.substr($code, $end + 1);
    }

    return $code;
}

/**
 * Lines whose string literals spell the old name, for a person to check.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @return list<string>
 */
function stringsSpelling(array $files, string $old): array
{
    $lines = [];
    $finder = new NodeFinder();

    foreach ($files as $path => $file) {
        foreach ($finder->findInstanceOf($file['statements'], Node\Scalar\String_::class) as $string) {
            if ($string->value === $old) {
                $lines[] = "{$path}:{$string->getStartLine()}";
            }
        }
    }

    return $lines;
}

/**
 * Runs the renames on fixtures in a temporary project and compares every file with what it must become.
 */
function selfTest(): int
{
    $root = sys_get_temp_dir().'/rename-member-'.getmypid();
    $failed = 0;

    foreach (testCases() as [$why, $rename, $with, $before, $after, $refused]) {
        exec('rm -rf '.escapeshellarg($root));

        foreach ($before as $file => $code) {
            @mkdir(dirname($root.'/'.$file), 0777, true);
            file_put_contents($root.'/'.$file, $code);
        }

        try {
            renameMember($root, $rename, $with, false);
            $got = false;
        } catch (RuntimeException) {
            $got = true;
        }

        $held = $got === $refused;

        foreach ($after as $file => $code) {
            $held = $held && file_get_contents($root.'/'.$file) === $code;
        }

        if (! $held) {
            $failed++;
        }
        printf("  %s  %s\n", $held ? 'ok  ' : 'FAIL', $why);
    }

    exec('rm -rf '.escapeshellarg($root));
    printf("%d case(s), %d failed\n", count(testCases()), $failed);

    return $failed > 0 ? 1 : 0;
}

/**
 * @return list<array{string, list<string>, list<string>, array<string, string>, array<string, string>, bool}>
 */
function testCases(): array
{
    $identity = "<?php\nnamespace App\\Ids;\nfinal class Identity\n{\n    public const KIND_COUNT = 2;\n\n    /**\n     * @param  string  \$kind  the kind\n     */\n    public function __construct(public string \$kind, public int \$id)\n    {\n        \$this->check(\$kind);\n    }\n\n    public function isSameAs(self \$other): bool\n    {\n        return \$this->kind === \$other->kind && self::KIND_COUNT > 0;\n    }\n\n    private function check(string \$kind): void {}\n}\n";
    $user = "<?php\nnamespace App\\Use;\nuse App\\Ids\\Identity;\nfunction run(Identity \$one): string\n{\n    \$kind = \$one->kind;\n    \$two = new Identity(kind: 'a', id: 1);\n\n    return \$two->isSameAs(\$one) ? \$kind.Identity::KIND_COUNT : 'kind';\n}\n";

    return [
        ['a property, its promoted parameter, accesses and named arguments', ['property', 'App\\Ids\\Identity', 'kind', 'type'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            ['app/Ids/Identity.php' => str_replace(['public string $kind', '$this->check($kind)', '@param  string  $kind', '$this->kind', '$other->kind'], ['public string $type', '$this->check($type)', '@param  string  $type', '$this->type', '$other->type'], $identity),
                'app/Use/run.php' => str_replace(['$one->kind', 'kind: \'a\''], ['$one->type', 'type: \'a\''], $user)], false],
        ['a method and its calls', ['method', 'App\\Ids\\Identity', 'isSameAs', 'matches'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            ['app/Ids/Identity.php' => str_replace('function isSameAs', 'function matches', $identity), 'app/Use/run.php' => str_replace('->isSameAs(', '->matches(', $user)], false],
        ['a constant and its fetches', ['constant', 'App\\Ids\\Identity', 'KIND_COUNT', 'TYPE_COUNT'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            ['app/Ids/Identity.php' => str_replace('KIND_COUNT', 'TYPE_COUNT', $identity), 'app/Use/run.php' => str_replace('KIND_COUNT', 'TYPE_COUNT', $user)], false],
        ['a variable in a folder, its parameter and its @param line', ['variable', 'app/Use', 'kind', 'type'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => str_replace(['$kind = ', '? $kind.'], ['$type = ', '? $type.'], $user)], false],
        ['a property another class also declares is refused', ['property', 'App\\Ids\\Identity', 'kind', 'type'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$kind = '';\n}\n"],
            ['app/Ids/Identity.php' => $identity], true],
        ['naming the other class with --with renames both', ['property', 'App\\Ids\\Identity', 'kind', 'type'], ['App\\Ids\\Other'],
            ['app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$kind = '';\n}\n", 'app/Ids/Identity.php' => $identity],
            ['app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$type = '';\n}\n"], false],
    ];
}
