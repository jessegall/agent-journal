<?php

declare(strict_types=1);

/**
 * Renames a class member and its references, or a variable within a folder, file or function, by the rules in
 * docs/naming/renaming-members.md. Strings that spell the old name are listed for checking by hand, never changed.
 *
 *   php tools/refactoring/rename-member.php method   App\\Core\\Actors\\Support\\ActorIdentity isSameAs matches
 *   php tools/refactoring/rename-member.php property App\\Core\\Actors\\Support\\ActorIdentity kind type
 *   php tools/refactoring/rename-member.php constant App\\Core\\Web\\Pages\\LoginPage COMPONENT PAGE
 *   php tools/refactoring/rename-member.php variable app/Core/Assignments kind type
 *   php tools/refactoring/rename-member.php variable app/Example.php:17 count itemCount
 *   php tools/refactoring/rename-member.php --list=tools/refactoring/members.txt
 *   php tools/refactoring/rename-member.php ... --dry-run
 *   php tools/refactoring/rename-member.php --test
 */

require dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/php-parse.php';
require_once __DIR__.'/promoted-parameters.php';

use App\Support\Reflector;
use PhpParser\Comment\Doc;
use PhpParser\Node;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\NodeVisitorAbstract;

ini_set('memory_limit', '4G');

/**
 * What an instance call's receiver resolves to: a type of the renamed family, another type, or nothing the code says.
 */
enum Receiver
{
    case InFamily;
    case Elsewhere;
    case Unknown;
}

/**
 * A rename this tool refuses, with the reason it prints.
 */
final class RenameRefused extends RuntimeException
{
    public static function malformed(): self
    {
        return new self(
            'a rename is: method|property|constant <class> <old> <new>, or variable <folder|file[:line]> <old> <new>',
        );
    }

    public static function parameterMissing(string $path, int $line, string $parameter): self
    {
        return new self(sprintf(
            '%s:%d must hold a parameter $%s of one function, method or closure that is not a promoted property',
            $path,
            $line,
            $parameter,
        ));
    }

    public static function undeclaredClass(string $class): self
    {
        return new self(sprintf('%s is not declared in the project', $class));
    }

    public static function noMember(string $class, string $what, string $old): self
    {
        return new self(sprintf('%s declares no %s %s', $class, $what, $old));
    }

    public static function nameTaken(string $type, string $what, string $new): self
    {
        return new self(sprintf('%s already declares a %s %s', $type, $what, $new));
    }
}

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

        $declares = $node instanceof Node\Stmt\ClassMethod || $node instanceof Node\PropertyItem
            || $node instanceof Node\Const_ || $node instanceof Node\Expr\StaticCall;

        if ($this->types !== [] && $declares) {
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

const SEARCHED = [
    'app',
    'domain',
    'tests',
    'routes',
    'bootstrap',
    'config',
    'database',
];
const SKIPPED = [
    'vendor',
    'node_modules',
];

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
        str_starts_with($argument, '--with=') => $with = [
            ...$with,
            ...array_map(static fn (string $name) => ltrim($name, '\\'), explode(',', substr($argument, 7))),
        ],
        str_starts_with($argument, '--list=') => $renames = [...$renames, ...listedRenames(substr($argument, 7))],
        default => $words[] = $argument,
    };
}

if ($words !== []) {
    $renames[] = $words;
}

if ($renames === []) {
    fwrite(STDERR, "Usage: rename-member.php method|property|constant <class> <old> <new>\n"
        ."    or: rename-member.php variable <folder|file[:line]> <old> <new> [--dry-run]\n");
    exit(2);
}

$failed = 0;
// The project is parsed and indexed once for the whole list, and each file is written once at the end: a list of
// renames costs one parse, not one per line.
$project = new ParsedProject($root);
$editsByFile = [];

foreach ($renames as $rename) {
    try {
        $changes = renameMember($project, $rename, $with);

        foreach ($changes['edits'] as $file => $fileEdits) {
            $editsByFile[$file] = [
                ...$editsByFile[$file] ?? [],
                ...$fileEdits,
            ];
        }

        printf(
            "%s %s: %d change(s) in %d file(s)\n",
            $dry ? 'Would rename' : 'Renamed',
            implode(' ', $rename),
            array_sum(array_map('count', $changes['edits'])),
            count($changes['edits']),
        );

        foreach ($changes['edits'] as $file => $edits) {
            printf("  %s: %d\n", $file, count($edits));
        }

        foreach ($changes['strings'] as $line) {
            printf("  check by hand, a string spells the old name: %s\n", $line);
        }

        foreach ($changes['unresolved'] as $site) {
            printf("  check by hand, left alone as its receiver's type is not known: %s\n", $site);
        }
    } catch (RuntimeException $refusal) {
        $failed++;
        fwrite(STDERR, 'Refused '.implode(' ', $rename).': '.$refusal->getMessage()."\n");
    }
}

if (! $dry) {
    foreach ($editsByFile as $file => $fileEdits) {
        file_put_contents($root.'/'.$file, applied($project->codeOf($file), $fileEdits));
    }
}

exit($failed > 0 ? 1 : 0);

/**
 * The project's PHP files parsed once, with the type index built from them once, for every rename of a list; a
 * variable's own folder or file outside the searched folders is parsed when first asked for.
 */
final class ParsedProject
{
    /** @var array<string, array{code: string, statements: list<Node>}>|null */
    private array|null $searched = null;

    /** @var array<string, mixed>|null */
    private array|null $index = null;

    /** @var array<string, array{code: string, statements: list<Node>}> */
    private array $others = [];

    /** @var array<string, array<string, list<Node>>>|null every node of the searched files by the name it carries */
    private array|null $named = null;

    public function __construct(public readonly string $root) {}

    /**
     * @return array<string, array{code: string, statements: list<Node>}>
     */
    public function searched(): array
    {
        return $this->searched ??= parsedFiles($this->root, SEARCHED);
    }

    /**
     * @return array<string, mixed>
     */
    public function index(): array
    {
        return $this->index ??= typeIndex($this->searched());
    }

    /**
     * The parsed files under a folder or file, from the one parse when it lies in it.
     *
     * @return array<string, array{code: string, statements: list<Node>}>
     */
    public function under(string $path): array
    {
        $isUnder = static fn (string $file): bool => $file === $path || str_starts_with($file, rtrim($path, '/').'/');

        foreach ([
            $this->searched(),
            $this->others,
        ] as $parsedAlready) {
            $inParsed = array_filter($parsedAlready, $isUnder, ARRAY_FILTER_USE_KEY);

            if ($inParsed !== []) {
                return $inParsed;
            }
        }

        $parsed = parsedFiles($this->root, [$path]);
        $this->others = [
            ...$this->others,
            ...$parsed,
        ];

        return $parsed;
    }

    /**
     * The nodes of the searched files that carry the name, by file: one walk of the project serves every rename.
     *
     * @return array<string, list<Node>>
     */
    public function nodesNamed(string $name): array
    {
        return ($this->named ??= nameIndex($this->searched()))[$name] ?? [];
    }

    public function codeOf(string $file): string
    {
        return ($this->searched()[$file] ?? $this->others[$file])['code'];
    }
}

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
 * The renaming of one member or variable, worked out on the one parse: the edits per file, and the strings and the calls of
 * an unresolved receiver left to check.
 *
 * @param  list<string>  $rename  the member kind word, the class or folder, the old name and the new name
 * @param  list<string>  $with  other classes whose member of the same name is renamed as well
 * @return array{edits: array<string, list<array{int, int, string}>>, strings: list<string>, unresolved: list<string>}
 */
function renameMember(ParsedProject $project, array $rename, array $with): array
{
    $root = $project->root;
    [$what, $owner, $old, $new] = array_pad($rename, 4, '');

    if (! in_array(
        $what,
        ['method', 'property', 'constant', 'variable', 'argument'],
        true,
    ) || $owner === '' || $old === '' || $new === '') {
        throw RenameRefused::malformed();
    }

    $scope = explode(':', $owner, 2);
    $path = $scope[0];
    $line = 0;

    if (isset($scope[1])) {
        $line = (int) $scope[1];

        if (! in_array($what, [
            'variable',
            'argument',
        ], true) || ! ctype_digit($scope[1]) || $line < 1 || ! is_file($root.'/'.$path)) {
            throw RenameRefused::malformed();
        }
    }

    if ($what === 'argument') {
        // the parameter already carries the new name: only the calls that pass it by its old name are left
        [$function] = parameterScope($project->under($path)[$path]['statements'], $path, $line, $new);

        return [
            'edits' => namedArgumentEdits($project, $function, $old, $new),
            'unresolved' => [],
            'strings' => [],
        ];
    }

    $files = $what === 'variable' ? $project->under($path) : $project->searched();
    $named = $what === 'variable' ? nameIndex($files)[$old] ?? [] : $project->nodesNamed($old);
    $changes = $what === 'variable'
        ? [
            'edits' => variableEdits($files, $old, $new, $line),
            'unresolved' => [],
        ]
        : memberEdits($files, $named, $project->index(), $what, ltrim($owner, '\\'), $old, $new, $with);

    if ($what === 'variable' && $line > 0) {
        [$function] = parameterScope($files[$path]['statements'], $path, $line, $old);

        foreach (namedArgumentEdits($project, $function, $old, $new) as $file => $sites) {
            $changes['edits'][$file] = [
                ...$changes['edits'][$file] ?? [],
                ...$sites,
            ];
        }
    }

    return [
        ...$changes,
        'strings' => stringsSpelling($named, $old),
    ];
}

/**
 * Every PHP file under the folders, parsed with names resolved.
 *
 * @param  list<string>  $folders
 * @return array<string, array{code: string, statements: list<Node>}>
 */
function parsedFiles(string $root, array $folders): array
{
    $files = [];

    foreach ($folders as $folder) {
        $path = $root.'/'.$folder;

        if (! is_dir($path) && ! is_file($path)) {
            continue;
        }

        $entries = is_file($path)
            ? new ArrayIterator([new SplFileInfo($path)])
            : new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));

        foreach ($entries as $file) {
            $name = $file->getPathname();

            if ($file->getExtension() !== 'php' || array_filter(
                SKIPPED,
                static fn (string $skip): bool => str_contains($name, '/'.$skip.'/'),
            ) !== []) {
                continue;
            }

            $code = (string) file_get_contents($name);
            $statements = parsedOnce($name, $code);
            $traverser = new NodeTraverser(new NameResolver(), new DeclaringTypeMarker(), new ParentConnectingVisitor());
            $files[substr($name, strlen($root) + 1)] = [
                'code' => $code,
                'statements' => $traverser->traverse($statements),
            ];
        }
    }

    ksort($files);

    return $files;
}

/**
 * The project's classes, interfaces and traits, each with the types it is related to and the members it declares.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @return array<string, array{related: list<string>, method: list<string>, property: list<string>,
 *     constant: list<string>, propertyTypes: array<string, string|null>, returns: array<string, string|null>}>
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
            $parent = $type instanceof Node\Stmt\Class_ ? $type->extends?->toString() : null;

            if ($type instanceof Node\Stmt\Class_) {
                $related = array_map(
                    static fn (Node\Name $name) => $name->toString(),
                    array_values(array_filter([$type->extends, ...$type->implements])),
                );
            }

            if ($type instanceof Node\Stmt\Interface_) {
                $related = array_map(static fn (Node\Name $name) => $name->toString(), $type->extends);
            }

            foreach ($type->getTraitUses() as $use) {
                array_push($related, ...array_map(static fn (Node\Name $name) => $name->toString(), $use->traits));
            }

            $self = $type->namespacedName->toString();
            $properties = [];
            $propertyTypes = [];

            foreach ($type->getProperties() as $property) {
                foreach ($property->props as $item) {
                    $properties[] = $item->name->toString();
                    $propertyTypes[$item->name->toString()] = typeName($property->type, $self);
                }
            }

            foreach ($type->getMethod('__construct')?->params ?? [] as $param) {
                if (isPromoted($param)) {
                    $properties[] = $param->var->name;
                    $propertyTypes[$param->var->name] = typeName($param->type, $self);
                }
            }

            $returns = [];

            foreach ($type->getMethods() as $method) {
                $returns[$method->name->toString()] = typeName($method->returnType, $self);
            }

            $constants = [];

            foreach ($type->getConstants() as $constant) {
                array_push(
                    $constants,
                    ...array_map(static fn (Node\Const_ $const) => $const->name->toString(), $constant->consts),
                );
            }

            $index[$type->namespacedName->toString()] = [
                'related' => $related,
                'method' => array_map(
                    static fn (Node\Stmt\ClassMethod $method) => $method->name->toString(),
                    $type->getMethods(),
                ),
                'static' => array_values(array_map(
                    static fn (Node\Stmt\ClassMethod $method) => $method->name->toString(),
                    array_filter($type->getMethods(), static fn (Node\Stmt\ClassMethod $method) => $method->isStatic()),
                )),
                'parent' => $parent,
                'property' => $properties,
                'propertyTypes' => $propertyTypes,
                'returns' => $returns,
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
 * The class and every project class that extends it, directly or further down: the classes a static call through
 * one of them can reach. Interfaces and traits play no part, as a static call always names its class.
 *
 * @param  array<string, array{parent: string|null}>  $index
 * @return list<string>
 */
function descendantsOf(array $index, string $class): array
{
    $line = [$class];

    for ($at = 0; $at < count($line); $at++) {
        foreach ($index as $other => $entry) {
            if ($entry['parent'] === $line[$at] && ! in_array($other, $line, true)) {
                $line[] = $other;
            }
        }
    }

    return $line;
}

/**
 * The edits renaming a method, property or constant of the class and its family everywhere it is named, and the
 * calls and accesses whose receiver could not be resolved while another class shares the name, left for checking.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @param  list<string>  $with
 * @return array{edits: array<string, list<array{int, int, string}>>, unresolved: list<string>}
 */
function memberEdits(array $files, array $named, array $index, string $what, string $class, string $old, string $new, array $with): array
{
    if (! isset($index[$class])) {
        throw RenameRefused::undeclaredClass($class);
    }

    // a static call names its class, so a static method is renamed at the calls that resolve to it, however many
    // other classes declare a method of the same name
    $static = $what === 'method' && in_array($old, $index[$class]['static'], true);
    $family = [];

    foreach ([
        $class,
        ...$with,
    ] as $start) {
        foreach ($static ? descendantsOf($index, $start) : familyOf($index, $start) as $member) {
            $family[$member] = true;
        }
    }

    if (! array_filter(array_keys($family), static fn (string $type) => in_array($old, $index[$type][$what], true))) {
        throw RenameRefused::noMember($class, $what, $old);
    }

    $others = array_keys(
        array_filter($index, static fn (array $entry, string $type) => ! isset($family[$type]) && in_array($old, $entry[$what], true), ARRAY_FILTER_USE_BOTH),
    );

    // with no other class declaring the name, every call by that name is the family's
    $receiverOf = $what === 'constant' || $static || $others === []
        ? static fn (Node\Expr $receiver): Receiver => Receiver::InFamily
        : static fn (Node\Expr $receiver): Receiver => receiverIn(receiverType($receiver, $index), $family);

    foreach (array_keys($family) as $type) {
        if (in_array($new, $index[$type][$what], true)) {
            throw RenameRefused::nameTaken($type, $what, $new);
        }
    }

    $edits = [];
    $unresolved = [];

    foreach ($named as $path => $nodes) {
        $found = [];

        foreach ($nodes as $node) {
            array_push($found, ...memberSites($node, $what, $old, $new, $family, $receiverOf, $static));

            if (isInstanceUse($node, $what, $old) && $receiverOf($node->var) === Receiver::Unknown) {
                $unresolved[] = $path.':'.$node->getStartLine();
            }
        }

        if ($what === 'property') {
            array_push($found, ...promotedVariableSites($files[$path]['statements'], $old, $new, $family));
        }

        if ($found !== []) {
            $edits[$path] = $found;
        }
    }

    return [
        'edits' => $edits,
        'unresolved' => $unresolved,
    ];
}

/**
 * Whether the node calls or reads the member by name on an instance: a method call, or a property access.
 *
 * @phpstan-assert-if-true Node\Expr\MethodCall|Node\Expr\NullsafeMethodCall|Node\Expr\PropertyFetch|Node\Expr\NullsafePropertyFetch $node
 */
function isInstanceUse(Node $node, string $what, string $old): bool
{
    $isUse = match ($what) {
        'method' => $node instanceof Node\Expr\MethodCall || $node instanceof Node\Expr\NullsafeMethodCall,
        'property' => $node instanceof Node\Expr\PropertyFetch || $node instanceof Node\Expr\NullsafePropertyFetch,
        default => false,
    };

    return $isUse && $node->name instanceof Node\Identifier && $node->name->toString() === $old;
}

/**
 * Where a resolved receiver type lies: in the renamed family, elsewhere, or unknown when it could not be resolved.
 *
 * @param  array<string, true>  $family
 */
function receiverIn(string|null $type, array $family): Receiver
{
    return match (true) {
        $type === null => Receiver::Unknown,
        isset($family[$type]) => Receiver::InFamily,
        default => Receiver::Elsewhere,
    };
}

/**
 * The class a receiver expression resolves to, read from the code alone: $this, a typed property, a typed parameter,
 * a local given its value once, a new, a container make of a class constant, or a call whose method declares its
 * return type. Null when the code does not say.
 *
 * @param  array<string, array{related: list<string>, propertyTypes: array<string, string|null>,
 *     returns: array<string, string|null>}>  $index
 */
function receiverType(Node\Expr $receiver, array $index): string|null
{
    return match (true) {
        $receiver instanceof Node\Expr\Variable && $receiver->name === 'this' => enclosingClass($receiver),
        $receiver instanceof Node\Expr\Variable && is_string($receiver->name) => variableType($receiver, $receiver->name, $index),
        $receiver instanceof Node\Expr\New_ && $receiver->class instanceof Node\Name => $receiver->class->toString(),
        $receiver instanceof Node\Expr\FuncCall && $receiver->name instanceof Node\Name
            && in_array($receiver->name->toLowerString(), ['app', 'resolve'], true) => madeClass($receiver),
        $receiver instanceof Node\Expr\MethodCall && $receiver->name instanceof Node\Identifier
            && $receiver->name->toString() === 'make' => madeClass($receiver),
        $receiver instanceof Node\Expr\PropertyFetch, $receiver instanceof Node\Expr\NullsafePropertyFetch => memberType(receiverType($receiver->var, $index), $receiver->name, 'propertyTypes', $index),
        $receiver instanceof Node\Expr\MethodCall, $receiver instanceof Node\Expr\NullsafeMethodCall => memberType(receiverType($receiver->var, $index), $receiver->name, 'returns', $index),
        $receiver instanceof Node\Expr\StaticCall && $receiver->class instanceof Node\Name => memberType(staticClass($receiver->class), $receiver->name, 'returns', $index),
        default => null,
    };
}

/**
 * The class a container make or app() call builds, when its first argument is a class constant.
 */
function madeClass(Node\Expr\FuncCall|Node\Expr\MethodCall $call): string|null
{
    $first = $call->getArgs()[0]->value ?? null;
    $isClassConstant = $first instanceof Node\Expr\ClassConstFetch && $first->class instanceof Node\Name
        && $first->name instanceof Node\Identifier && $first->name->toString() === 'class';

    if ($isClassConstant) {
        return staticClass($first->class);
    }

    return null;
}

/**
 * The class a static name stands for: self, static and parent read as the class written around it.
 */
function staticClass(Node\Name $name): string|null
{
    if (in_array($name->toLowerString(), ['self', 'static'], true)) {
        return enclosingClass($name);
    }

    return $name->toString();
}

/**
 * The type a member of the class or one of its ancestors declares: a property's or a method's return type.
 *
 * @param  'propertyTypes'|'returns'  $kind
 * @param  array<string, array{related: list<string>, propertyTypes: array<string, string|null>,
 *     returns: array<string, string|null>}>  $index
 */
function memberType(string|null $class, Node $name, string $kind, array $index): string|null
{
    if ($class === null || ! $name instanceof Node\Identifier) {
        return null;
    }

    $line = [$class];

    for ($at = 0; $at < count($line); $at++) {
        $entry = $index[$line[$at]] ?? [
            'related' => [],
            $kind => [],
        ];

        if (array_key_exists($name->toString(), $entry[$kind])) {
            return $entry[$kind][$name->toString()];
        }

        array_push($line, ...array_diff($entry['related'], $line));
    }

    return null;
}

/**
 * The type of a local or parameter: its declared parameter type in the nearest function that has it, or the type of
 * the one value it is given there; null when it is given none or several.
 *
 * @param  array<string, array{related: list<string>, propertyTypes: array<string, string|null>,
 *     returns: array<string, string|null>}>  $index
 */
function variableType(Node $at, string $name, array $index): string|null
{
    $function = enclosing($at, Node\FunctionLike::class);

    if ($function === null) {
        return null;
    }

    foreach ($function->getParams() as $param) {
        if ($param->var instanceof Node\Expr\Variable && $param->var->name === $name) {
            return typeName($param->type, enclosingClass($function));
        }
    }

    $given = new NodeFinder()->find(
        $function->getStmts() ?? [],
        static fn (Node $node) => $node instanceof Node\Expr\Assign && isVariableNamed($node->var, $name),
    );

    return match (count($given)) {
        0 => $function instanceof Node\Expr\Closure || $function instanceof Node\Expr\ArrowFunction
            ? variableType($function, $name, $index)
            : null,
        1 => assignedType($given[0], $index),
        default => null,
    };
}

/**
 * The type a local's one assignment gives it; unknown when that assignment is already being read, as a local given
 * a value made from itself ($permissions = $permissions->with(...)) would be read without end.
 *
 * @param  array<string, array{related: list<string>, propertyTypes: array<string, string|null>,
 *     returns: array<string, string|null>}>  $index
 */
function assignedType(Node\Expr\Assign $assignment, array $index): string|null
{
    static $reading = [];
    $key = spl_object_id($assignment);

    if (isset($reading[$key])) {
        return null;
    }

    $reading[$key] = true;
    $type = receiverType($assignment->expr, $index);
    unset($reading[$key]);

    return $type;
}

/**
 * The class a type declaration names, with self and static read as the class it is written in; null for a built-in,
 * a union or no type.
 */
function typeName(Node|null $type, string|null $self): string|null
{
    return match (true) {
        $type instanceof Node\NullableType => typeName($type->type, $self),
        $type instanceof Node\Name, $type instanceof Node\Identifier => in_array(strtolower($type->toString()), [
            'self',
            'static',
        ], true) ? $self : classTypeName($type),
        default => null,
    };
}

function classTypeName(Node\Name|Node\Identifier $type): string|null
{
    if ($type instanceof Node\Name) {
        return $type->toString();
    }

    return null;
}

/**
 * The full name of the class, interface or trait the node is written in; null outside one.
 */
/**
 * Whether the node stands inside a class of the family.
 *
 * @param  array<string, true>  $family
 */
function isInsideFamily(Node $node, array $family): bool
{
    $class = enclosingClass($node);

    return $class !== null && isset($family[$class]);
}

function enclosingClass(Node $node): string|null
{
    return enclosing($node, Node\Stmt\ClassLike::class)?->namespacedName?->toString();
}

/**
 * The nearest node above of the kind given.
 *
 * @template T of Node
 *
 * @param  class-string<T>  $kind
 * @return T|null
 */
function enclosing(Node $node, string $kind): Node|null
{
    $type = Reflector::of($kind);

    for ($parent = $node->getAttribute('parent'); $parent instanceof Node; $parent = $parent->getAttribute('parent')) {
        if ($type->isInstance($parent)) {
            return $parent;
        }
    }

    return null;
}

/**
 * The places one node names the member: its declaration in the family, an instance call or access by name, a static
 * call, access or constant of the family, and a named argument passed to a family constructor.
 *
 * @param  array<string, true>  $family
 * @param  Closure(Node\Expr): Receiver  $receiverOf
 * @return list<array{int, int, string}>
 */
function memberSites(
    Node $node,
    string $what,
    string $old,
    string $new,
    array $family,
    Closure $receiverOf,
    bool $isStatic = false,
): array {
    $sites = [];
    // self, static and parent name the class the code stands in, so they belong to the family only inside one of it
    $inFamily = static fn (Node|null $class): bool => $class instanceof Node\Name && (isset($family[$class->toString()]) || (in_array(
        $class->toLowerString(),
        ['self', 'static', 'parent'],
        true,
    ) && isInsideFamily($node, $family)));

    if ($what === 'method' && $isStatic) {
        $named = match (true) {
            $node instanceof Node\Stmt\ClassMethod => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\StaticCall => staticCallReaches($node, $family) ? $node->name : null,
            default => null,
        };
    } elseif ($what === 'method') {
        $named = match (true) {
            $node instanceof Node\Stmt\ClassMethod => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\MethodCall, $node instanceof Node\Expr\NullsafeMethodCall => $receiverOf($node->var) === Receiver::InFamily ? $node->name : null,
            $node instanceof Node\Expr\StaticCall => $inFamily($node->class) ? $node->name : null,
            default => null,
        };
    } elseif ($what === 'property') {
        $named = match (true) {
            $node instanceof Node\PropertyItem => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\PropertyFetch, $node instanceof Node\Expr\NullsafePropertyFetch => $receiverOf($node->var) === Receiver::InFamily ? $node->name : null,
            $node instanceof Node\Expr\StaticPropertyFetch => $inFamily($node->class) ? $node->name : null,
            default => null,
        };

        if ($node instanceof Node\Expr\New_ && $inFamily($node->class)) {
            array_push($sites, ...namedArgumentSites($node, $old, $new));
        }
    } else {
        $named = match (true) {
            $node instanceof Node\Const_ => isset($family[declaringType($node)]) ? $node->name : null,
            $node instanceof Node\Expr\ClassConstFetch => $inFamily($node->class) ? $node->name : null,
            default => null,
        };
    }

    if (($named instanceof Node\Identifier || $named instanceof Node\VarLikeIdentifier) && $named->toString() === $old) {
        $sites[] = [
            $named->getStartFilePos(),
            $named->getEndFilePos(),
            $new,
        ];
    }

    return $sites;
}

/**
 * Whether a static call reaches the class or one of its descendants: by the class it names, or by self, static or
 * parent inside one of them.
 *
 * @param  array<string, true>  $family
 */
function staticCallReaches(Node\Expr\StaticCall $call, array $family): bool
{
    if (! $call->class instanceof Node\Name) {
        return false;
    }

    if (in_array($call->class->toLowerString(), ['self', 'static', 'parent'], true)) {
        return isset($family[declaringType($call)]);
    }

    return isset($family[$call->class->toString()]);
}

/**
 * The named arguments of a constructor call that pass the old property name.
 *
 * @return list<array{int, int, string}>
 */
function namedArgumentSites(Node\Expr\New_ $node, string $old, string $new): array
{
    $sites = [];

    foreach ($node->args as $argument) {
        if ($argument instanceof Node\Arg && $argument->name?->toString() === $old) {
            $sites[] = [
                $argument->name->getStartFilePos(),
                $argument->name->getEndFilePos(),
                $new,
            ];
        }
    }

    return $sites;
}

/**
 * Whether the node is the variable of that name.
 */
function isVariableNamed(Node $node, string $name): bool
{
    return $node instanceof Node\Expr\Variable && $node->name === $name;
}

/**
 * A promoted constructor parameter is also a variable in its constructor: the parameter, its uses there and its
 * docblock line follow the property.
 *
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

        $promoted = array_filter(
            $method->params,
            static fn (Node\Param $param) => isPromoted($param) && $param->var->name === $old,
        );

        if ($promoted === []) {
            continue;
        }

        foreach ($finder->find($method, static fn (Node $node) => isVariableNamed($node, $old)) as $variable) {
            $sites[] = [
                $variable->getStartFilePos(),
                $variable->getEndFilePos(),
                '$'.$new,
            ];
        }

        array_push($sites, ...docSites($method->getDocComment(), $old, $new));
    }

    return $sites;
}

/**
 * The edits renaming a variable and its closure uses and @param lines.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @return array<string, list<array{int, int, string}>>
 */
function variableEdits(array $files, string $old, string $new, int $line): array
{
    $edits = [];
    $finder = new NodeFinder();

    foreach ($files as $path => $file) {
        $found = [];
        $statements = $line > 0 ? parameterScope($file['statements'], $path, $line, $old) : $file['statements'];

        foreach ($finder->find($statements, static fn (Node $node) => isVariableNamed($node, $old)) as $variable) {
            $found[] = [
                $variable->getStartFilePos(),
                $variable->getEndFilePos(),
                '$'.$new,
            ];
        }

        foreach ($finder->find(
            $statements,
            static fn (Node $node) => $node instanceof Node\FunctionLike,
        ) as $function) {
            array_push($found, ...docSites($function->getDocComment(), $old, $new));
        }

        if ($found !== []) {
            $edits[$path] = $found;
        }
    }

    return $edits;
}

/**
 * The function, method or closure whose parameter of that name stands on the line, innermost first; a promoted
 * property is renamed as a property, never here.
 *
 * @param  list<Node>  $statements
 * @return list<Node>
 */
function parameterScope(array $statements, string $path, int $line, string $parameter): array
{
    $finder = new NodeFinder();
    $functions = $finder->find(
        $statements,
        static fn (Node $node) => $node instanceof Node\FunctionLike && array_any(
            $node->getParams(),
            static fn (Node\Param $param) => isVariableNamed($param->var, $parameter) && $param->getStartLine() === $line && $param->flags === 0,
        ),
    );
    $innermost = array_find(
        $functions,
        static fn (Node $function) => array_all($functions, static fn (Node $other) => $other === $function || $other->getStartFilePos() <= $function->getStartFilePos()),
    );

    if (! $innermost instanceof Node\FunctionLike) {
        throw RenameRefused::parameterMissing($path, $line, $parameter);
    }

    return [$innermost];
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

    return array_map(
        static fn (array $match) => [
            $doc->getStartFilePos() + $match[1],
            $doc->getStartFilePos() + $match[1] + strlen($match[0]) - 1,
            '$'.$new,
        ],
        $matches[0],
    );
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
function applied(string $source, array $edits): string
{
    $unique = [];

    foreach ($edits as $edit) {
        $unique[$edit[0]] = $edit;
    }

    krsort($unique);
    $code = $source;

    $edited = $code;

    foreach ($unique as [$start, $end, $text]) {
        // a declared property's name spans its $, which the new name keeps
        $sigil = $edited[$start] === '$' && ! str_starts_with($text, '$') ? '$' : '';
        $edited = substr($edited, 0, $start).$sigil.$text.substr($edited, $end + 1);
    }

    return $edited;
}

/**
 * Lines whose string literals spell the old name, for a user to check; a migration may name what came before, so it
 * is left out.
 *
 * @param  array<string, list<Node>>  $named  the nodes carrying the old name, by file
 * @return list<string>
 */
function stringsSpelling(array $named, string $old): array
{
    $lines = [];

    foreach ($named as $path => $nodes) {
        foreach ($nodes as $node) {
            if ($node instanceof Node\Scalar\String_ && $node->value === $old && ! str_contains($path, '/migrations/')) {
                $lines[] = "{$path}:{$node->getStartLine()}";
            }
        }
    }

    return $lines;
}

/**
 * The named arguments that pass the function's parameter by its old name, at every call that names the function: a
 * call of a method by its name, a call of the function, or a new of the class for its constructor.
 *
 * @return array<string, list<array{int, int, string}>>
 */
function namedArgumentEdits(ParsedProject $project, Node\FunctionLike $function, string $old, string $new): array
{
    $isConstructor = $function instanceof Node\Stmt\ClassMethod && $function->name->toLowerString() === '__construct';
    $functionName = $function instanceof Node\Stmt\ClassMethod || $function instanceof Node\Stmt\Function_ ? $function->name->toString() : null;
    $classOf = static fn (Node\Expr\New_ $node): string|null => match (true) {
        ! $node->class instanceof Node\Name => null,
        in_array($node->class->toLowerString(), ['self', 'static'], true) => enclosingClass($node),
        default => $node->class->toString(),
    };
    $callsFunction = static fn (Node $node): bool => match (true) {
        $functionName === null => false,
        $isConstructor => $node instanceof Node\Expr\New_ && $classOf($node) === declaringType($function),
        $node instanceof Node\Expr\MethodCall, $node instanceof Node\Expr\NullsafeMethodCall, $node instanceof Node\Expr\StaticCall => $node->name instanceof Node\Identifier && $node->name->toString() === $functionName,
        $node instanceof Node\Expr\FuncCall => $node->name instanceof Node\Name && $node->name->getLast() === $functionName,
        default => false,
    };
    $edits = [];

    foreach ($project->nodesNamed($old) as $path => $nodes) {
        foreach (array_filter($nodes, $callsFunction) as $call) {
            foreach ($call->args as $argument) {
                if ($argument instanceof Node\Arg && $argument->name?->toString() === $old) {
                    $edits[$path][] = [
                        $argument->name->getStartFilePos(),
                        $argument->name->getEndFilePos(),
                        $new,
                    ];
                }
            }
        }
    }

    return $edits;
}

/**
 * Every node of the files by the name it carries, in one walk: a member's name, a named argument's, a parameter's or a
 * string's value.
 *
 * @param  array<string, array{code: string, statements: list<Node>}>  $files
 * @return array<string, array<string, list<Node>>>
 */
function nameIndex(array $files): array
{
    $index = [];
    $finder = new NodeFinder();

    foreach ($files as $path => $file) {
        foreach ($finder->find($file['statements'], static fn (Node $node) => true) as $node) {
            foreach (namesCarriedBy($node) as $name) {
                $index[$name][$path][] = $node;
            }
        }
    }

    return $index;
}

/**
 * @return list<string>
 */
function namesCarriedBy(Node $node): array
{
    $name = in_array('name', $node->getSubNodeNames(), true) ? $node->name : null;

    $argumentNames = $node instanceof Node\Expr\CallLike && ! $node->isFirstClassCallable() ? array_filter(array_map(
        static fn ($argument) => $argument instanceof Node\Arg ? $argument->name?->toString() : null,
        $node->args,
    )) : [];
    $ownNames = match (true) {
        $node instanceof Node\Scalar\String_ => [$node->value],
        $node instanceof Node\Param && $node->var instanceof Node\Expr\Variable && is_string($node->var->name) => [$node->var->name],
        $name instanceof Node\Identifier || $name instanceof Node\VarLikeIdentifier => [$name->toString()],
        $name instanceof Node\Name => [$name->getLast()],
        default => [],
    };

    return array_values(array_unique([...$ownNames, ...$argumentNames]));
}

/**
 * Whether parsing one file twice in a run is refused by the parse funnel.
 */
function isSecondParseStopped(): bool
{
    parsedOnce('second-parse-check.php', '<?php');

    try {
        parsedOnce('second-parse-check.php', '<?php');
    } catch (LogicException) {
        return true;
    }

    return false;
}

/**
 * Runs the renames on fixtures in a temporary project and compares every file with what it must become.
 */
function selfTest(): int
{
    $failed = 0;

    foreach (testCases() as $case => [$why, $rename, $with, $before, $after, $refused, $unresolved]) {
        // Each case gets a folder of its own, since a file is parsed once per run.
        $root = sys_get_temp_dir().'/rename-member-'.getmypid()."-{$case}";
        exec('rm -rf '.escapeshellarg($root));

        foreach ($before as $file => $code) {
            @mkdir(dirname($root.'/'.$file), 0777, true);
            file_put_contents($root.'/'.$file, $code);
        }

        try {
            $project = new ParsedProject($root);
            $changes = renameMember($project, $rename, $with);

            foreach ($changes['edits'] as $file => $fileEdits) {
                file_put_contents($root.'/'.$file, applied($project->codeOf($file), $fileEdits));
            }

            $listed = $changes['unresolved'];
            $got = false;
        } catch (RuntimeException) {
            $listed = [];
            $got = true;
        }

        $held = $got === $refused && $listed === $unresolved;

        foreach ($after as $file => $code) {
            $held = $held && file_get_contents($root.'/'.$file) === $code;
        }

        if (! $held) {
            $failed++;
        }
        printf("  %s  %s\n", $held ? 'ok  ' : 'FAIL', $why);
        exec('rm -rf '.escapeshellarg($root));
    }

    $isSecondParseStopped = isSecondParseStopped();
    $failed += $isSecondParseStopped ? 0 : 1;
    printf("  %s  %s\n", $isSecondParseStopped ? 'ok  ' : 'FAIL', 'a file parsed a second time stops the run');
    printf("%d case(s), %d failed\n", count(testCases()) + 1, $failed);

    if ($failed > 0) {
        return 1;
    }

    return 0;
}

/**
 * @return list<array{string, list<string>, list<string>, array<string, string>, array<string, string>, bool,
 *     list<string>}>
 */
function testCases(): array
{
    $identity = "<?php\nnamespace App\\Ids;\nfinal class Identity\n{\n    public const KIND_COUNT = 2;\n\n    /**\n     * @param  string  \$kind  the kind\n     */\n    public function __construct(public string \$kind, public int \$id)\n    {\n        \$this->check(\$kind);\n    }\n\n    public function isSameAs(self \$other): bool\n    {\n        return \$this->kind === \$other->kind && self::KIND_COUNT > 0;\n    }\n\n    private function check(string \$kind): void {}\n}\n";
    $user = "<?php\nnamespace App\\Use;\nuse App\\Ids\\Identity;\nfunction run(Identity \$one): string\n{\n    \$kind = \$one->kind;\n    \$two = new Identity(kind: 'a', id: 1);\n\n    return \$two->isSameAs(\$one) ? \$kind.Identity::KIND_COUNT : 'kind';\n}\n";
    $other = "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$kind = '';\n}\n";
    $owners = [
        'app/Units/Owner.php' => "<?php\nnamespace App\\Units;\ninterface Owner\n{\n    public function own(): void;\n}\n",
        'app/Units/Store.php' => "<?php\nnamespace App\\Units;\nfinal class Store implements Owner\n{\n    public function own(): void {}\n}\n",
        'app/Memories/Memories.php' => "<?php\nnamespace App\\Memories;\nfinal class Memories\n{\n    public function own(): void {}\n}\n",
        'app/Use/Work.php' => <<<'PHP'
            <?php
            namespace App\Use;
            use App\Memories\Memories;
            use App\Units\Owner;
            final class Work
            {
                public function __construct(private Owner $units) {}

                public function run(Owner $owner, Memories $memories, $mystery): void
                {
                    $this->units->own();
                    $owner->own();
                    app(Owner::class)->own();
                    $memories->own();
                    $mystery->own();
                }
            }

            PHP,
    ];
    $closures = <<<'PHP'
        <?php
        $repeat = fn (int $count) => array_fill(0, $count, 'text');
        $join = fn (array $count) => implode(', ', $count);
        PHP;
    $renamedClosure = <<<'PHP'
        <?php
        $repeat = fn (int $copyCount) => array_fill(0, $copyCount, 'text');
        $join = fn (array $count) => implode(', ', $count);
        PHP;

    $methods = <<<'PHP'
        <?php
        final class Gate {
            public function __construct(public bool $ready) {}
            public function open(bool $ready): bool { return $ready; }
            public function close(bool $ready): bool { return ! $ready; }
        }
        PHP;
    $door = <<<'PHP'
        <?php
        final class Door {
            public function __construct(public bool $ready) {}
            public static function shut(): self { return new self(ready: false); }
        }
        PHP;
    $caller = <<<'PHP'
        <?php
        $gate = new Gate(ready: true);
        $gate->open(ready: true);
        $gate->close(ready: false);
        PHP;
    $renamedMethods = str_replace('open(bool $ready): bool { return $ready; }', 'open(bool $isReady): bool { return $isReady; }', $methods);

    return [
        [
            'a property, its promoted parameter, accesses and named arguments',
            [
                'property',
                'App\\Ids\\Identity',
                'kind',
                'type',
            ],
            [],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Use/run.php' => $user,
            ],
            [
                'app/Ids/Identity.php' => str_replace(
                    [
                        'public string $kind',
                        '$this->check($kind)',
                        '@param  string  $kind',
                        '$this->kind',
                        '$other->kind',
                    ],
                    [
                        'public string $type',
                        '$this->check($type)',
                        '@param  string  $type',
                        '$this->type',
                        '$other->type',
                    ],
                    $identity,
                ),
                'app/Use/run.php' => str_replace(
                    ['$one->kind', 'kind: \'a\''],
                    ['$one->type', 'type: \'a\''],
                    $user,
                ),
            ],
            false,
            [],
        ],
        [
            'a method and its calls',
            [
                'method',
                'App\\Ids\\Identity',
                'isSameAs',
                'matches',
            ],
            [],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Use/run.php' => $user,
            ],
            [
                'app/Ids/Identity.php' => str_replace('function isSameAs', 'function matches', $identity),
                'app/Use/run.php' => str_replace('->isSameAs(', '->matches(', $user),
            ],
            false,
            [],
        ],
        [
            'a constant and its fetches',
            [
                'constant',
                'App\\Ids\\Identity',
                'KIND_COUNT',
                'TYPE_COUNT',
            ],
            [],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Use/run.php' => $user,
            ],
            [
                'app/Ids/Identity.php' => str_replace('KIND_COUNT', 'TYPE_COUNT', $identity),
                'app/Use/run.php' => str_replace('KIND_COUNT', 'TYPE_COUNT', $user),
            ],
            false,
            [],
        ],
        [
            'a variable in a folder, its parameter and its @param line',
            [
                'variable',
                'app/Use',
                'kind',
                'type',
            ],
            [],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Use/run.php' => $user,
            ],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Use/run.php' => str_replace(['$kind = ', '? $kind.'], ['$type = ', '? $type.'], $user),
            ],
            false,
            [],
        ],
        [
            'a variable in one file leaves its neighbour alone',
            [
                'variable',
                'app/Use/one.php',
                'count',
                'itemCount',
            ],
            [],
            [
                'app/Use/one.php' => $closures,
                'app/Use/two.php' => $closures,
            ],
            [
                'app/Use/one.php' => str_replace('$count', '$itemCount', $closures),
                'app/Use/two.php' => $closures,
            ],
            false,
            [],
        ],
        [
            'a variable in one closure leaves its neighbour alone',
            [
                'variable',
                'app/Use/one.php:2',
                'count',
                'copyCount',
            ],
            [],
            ['app/Use/one.php' => $closures],
            ['app/Use/one.php' => $renamedClosure],
            false,
            [],
        ],
        [
            'new self in another class with the same property keeps its named argument',
            [
                'property',
                'Gate',
                'ready',
                'isReady',
            ],
            [],
            [
                'app/Use/methods.php' => $methods,
                'app/Use/door.php' => $door,
            ],
            [
                'app/Use/methods.php' => str_replace('public bool $ready', 'public bool $isReady', $methods),
                'app/Use/door.php' => $door,
            ],
            false,
            [],
        ],
        [
            'a method parameter by its line renames it in that method only',
            [
                'variable',
                'app/Use/methods.php:4',
                'ready',
                'isReady',
            ],
            [],
            [
                'app/Use/methods.php' => $methods,
                'app/Use/caller.php' => $caller,
            ],
            [
                'app/Use/methods.php' => $renamedMethods,
                'app/Use/caller.php' => str_replace('open(ready:', 'open(isReady:', $caller),
            ],
            false,
            [],
        ],
        [
            'a parameter already renamed has its named arguments follow',
            [
                'argument',
                'app/Use/methods.php:4',
                'ready',
                'isReady',
            ],
            [],
            [
                'app/Use/methods.php' => $renamedMethods,
                'app/Use/caller.php' => $caller,
            ],
            [
                'app/Use/methods.php' => $renamedMethods,
                'app/Use/caller.php' => str_replace('open(ready:', 'open(isReady:', $caller),
            ],
            false,
            [],
        ],
        [
            'a promoted parameter by its line is refused, as its property is renamed instead',
            [
                'variable',
                'app/Use/methods.php:3',
                'ready',
                'isReady',
            ],
            [],
            ['app/Use/methods.php' => $methods],
            ['app/Use/methods.php' => $methods],
            true,
            [],
        ],
        [
            'a closure rename refuses a malformed line',
            [
                'variable',
                'app/Use/one.php:line',
                'count',
                'copyCount',
            ],
            [],
            ['app/Use/one.php' => $closures],
            ['app/Use/one.php' => $closures],
            true,
            [],
        ],
        [
            'a closure rename refuses a name outside its parameters',
            [
                'variable',
                'app/Use/one.php:2',
                'join',
                'joinText',
            ],
            [],
            ['app/Use/one.php' => $closures],
            ['app/Use/one.php' => $closures],
            true,
            [],
        ],
        [
            'a property another class also declares is renamed on the receivers of its own class',
            [
                'property',
                'App\\Ids\\Identity',
                'kind',
                'type',
            ],
            [],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Ids/Other.php' => $other,
            ],
            [
                'app/Ids/Identity.php' => str_replace(
                    [
                        'public string $kind',
                        '$this->check($kind)',
                        '@param  string  $kind',
                        '$this->kind',
                        '$other->kind',
                    ],
                    [
                        'public string $type',
                        '$this->check($type)',
                        '@param  string  $type',
                        '$this->type',
                        '$other->type',
                    ],
                    $identity,
                ),
                'app/Ids/Other.php' => $other,
            ],
            false,
            [],
        ],
        [
            'a method another class also declares is renamed by its receiver, and an unknown receiver is listed',
            [
                'method',
                'App\\Units\\Owner',
                'own',
                'claim',
            ],
            [],
            $owners,
            [
                'app/Units/Owner.php' => str_replace('function own', 'function claim', $owners['app/Units/Owner.php']),
                'app/Units/Store.php' => str_replace('function own', 'function claim', $owners['app/Units/Store.php']),
                'app/Memories/Memories.php' => $owners['app/Memories/Memories.php'],
                'app/Use/Work.php' => str_replace(
                    ['$this->units->own()', '$owner->own()', 'app(Owner::class)->own()'],
                    ['$this->units->claim()', '$owner->claim()', 'app(Owner::class)->claim()'],
                    $owners['app/Use/Work.php'],
                ),
            ],
            false,
            ['app/Use/Work.php:15'],
        ],
        [
            'a static method is renamed only at the calls of its own class',
            [
                'method',
                'App\\Ids\\Note',
                'keep',
                'create',
            ],
            [],
            [
                'app/Ids/Note.php' => "<?php\nnamespace App\\Ids;\nfinal class Note\n{\n    public static function keep(): self\n    {\n        return new self();\n    }\n\n    public static function again(): self\n    {\n        return self::keep();\n    }\n}\n",
                'app/Ids/Ledger.php' => "<?php\nnamespace App\\Ids;\nfinal class Ledger\n{\n    public static function keep(): self\n    {\n        return self::keep();\n    }\n}\n",
                'app/Use/note.php' => "<?php\nuse App\\Ids\\Ledger;\nuse App\\Ids\\Note;\nNote::keep();\nLedger::keep();\n",
            ],
            [
                'app/Ids/Note.php' => "<?php\nnamespace App\\Ids;\nfinal class Note\n{\n    public static function create(): self\n    {\n        return new self();\n    }\n\n    public static function again(): self\n    {\n        return self::create();\n    }\n}\n",
                'app/Ids/Ledger.php' => "<?php\nnamespace App\\Ids;\nfinal class Ledger\n{\n    public static function keep(): self\n    {\n        return self::keep();\n    }\n}\n",
                'app/Use/note.php' => "<?php\nuse App\\Ids\\Ledger;\nuse App\\Ids\\Note;\nNote::create();\nLedger::keep();\n",
            ],
            false,
            [],
        ],
        [
            'naming the other class with --with renames both',
            [
                'property',
                'App\\Ids\\Identity',
                'kind',
                'type',
            ],
            ['App\\Ids\\Other'],
            [
                'app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$kind = '';\n}\n",
                'app/Ids/Identity.php' => $identity,
            ],
            [
                'app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$type = '';\n}\n",
            ],
            false,
            [],
        ],
    ];
}
