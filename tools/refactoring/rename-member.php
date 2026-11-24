<?php

declare(strict_types=1);

/**
 * Rename a class member and its references, or a variable within a folder, file or function.
 *
 *   php tools/refactoring/rename-member.php method   App\\Core\\Actors\\Support\\ActorIdentity isSameAs matches
 *   php tools/refactoring/rename-member.php property App\\Core\\Actors\\Support\\ActorIdentity kind type
 *   php tools/refactoring/rename-member.php constant App\\Core\\Web\\Pages\\LoginPage COMPONENT PAGE
 *   php tools/refactoring/rename-member.php variable app/Core/Assignments kind type
 *   php tools/refactoring/rename-member.php variable app/Example.php:17 count itemCount
 *   php tools/refactoring/rename-member.php --list=tools/refactoring/members.txt
 *   php tools/refactoring/rename-member.php ... --dry-run
 *   php tools/refactoring/rename-member.php --test
 *
 * A static method is renamed at every static call that resolves to its class or a class extending it, by the class
 * the call names or by self, static and parent inside one of them, however many other classes share its name.
 * Any other member is renamed in the class, in every project class, interface and trait it is related to by extends,
 * implements or use (an override keeps its parent's name), and at every call, access, constant fetch and named
 * argument. When another unrelated project class declares a member of the same name, an instance call or access is
 * renamed only when its receiver's type resolves to the family ($this, a typed property, parameter or return, a new
 * or a container make), left alone when it resolves elsewhere, and listed for checking by hand when it cannot be
 * resolved; --with=App\\Other\\Class renames the other class's member as well. A variable is renamed wherever it is used in the PHP files under the
 * folder or file, including closure uses and @param lines. A line selects a parameter of the closure there.
 * Strings that spell the old name are listed for checking by hand,
 * never changed. A list file holds one rename per line in the same words; blank lines and # lines are skipped.
 */

require dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/promoted-parameters.php';

use PhpParser\Comment\Doc;
use PhpParser\Node;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\NodeVisitorAbstract;
use PhpParser\ParserFactory;

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

    public static function closureParameterMissing(string $path, int $line, string $parameter): self
    {
        return new self(sprintf(
            '%s:%d must identify one closure with parameter $%s and no nested functions',
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

foreach ($renames as $rename) {
    try {
        $changes = renameMember($root, $rename, $with, $dry);
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
 * Renames one member or variable and returns what it changed: the edits per file, and the strings and the calls of
 * an unresolved receiver left to check.
 *
 * @param  list<string>  $rename  the member kind word, the class or folder, the old name and the new name
 * @param  list<string>  $with  other classes whose member of the same name is renamed as well
 * @return array{edits: array<string, list<array{int, int, string}>>, strings: list<string>, unresolved: list<string>}
 */
function renameMember(string $root, array $rename, array $with, bool $dry): array
{
    [$what, $owner, $old, $new] = array_pad($rename, 4, '');

    if (! in_array(
        $what,
        ['method', 'property', 'constant', 'variable'],
        true,
    ) || $owner === '' || $old === '' || $new === '') {
        throw RenameRefused::malformed();
    }

    $scope = explode(':', $owner, 2);
    $path = $scope[0];
    $line = 0;

    if (isset($scope[1])) {
        $line = (int) $scope[1];

        if ($what !== 'variable' || ! ctype_digit($scope[1]) || $line < 1 || ! is_file($root.'/'.$path)) {
            throw RenameRefused::malformed();
        }
    }

    $files = parsedFiles($root, $what === 'variable' ? [$path] : SEARCHED);
    $changes = $what === 'variable'
        ? ['edits' => variableEdits($files, $old, $new, $line), 'unresolved' => []]
        : memberEdits($files, $what, ltrim($owner, '\\'), $old, $new, $with);

    if (! $dry) {
        foreach ($changes['edits'] as $file => $fileEdits) {
            file_put_contents($root.'/'.$file, applied($files[$file]['code'], $fileEdits));
        }
    }

    return [...$changes, 'strings' => stringsSpelling($files, $old)];
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
            $statements = $parser->parse($code) ?? [];
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
function memberEdits(array $files, string $what, string $class, string $old, string $new, array $with): array
{
    $index = typeIndex($files);

    if (! isset($index[$class])) {
        throw RenameRefused::undeclaredClass($class);
    }

    // a static call names its class, so a static method is renamed at the calls that resolve to it, however many
    // other classes declare a method of the same name
    $static = $what === 'method' && in_array($old, $index[$class]['static'], true);
    $family = [];

    foreach ([$class, ...$with] as $start) {
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
    $finder = new NodeFinder();

    foreach ($files as $path => $file) {
        $found = [];

        foreach ($finder->find($file['statements'], static fn (Node $node) => true) as $node) {
            array_push($found, ...memberSites($node, $what, $old, $new, $family, $receiverOf, $static));

            if (isInstanceUse($node, $what, $old) && $receiverOf($node->var) === Receiver::Unknown) {
                $unresolved[] = $path.':'.$node->getStartLine();
            }
        }

        if ($what === 'property') {
            array_push($found, ...promotedVariableSites($file['statements'], $old, $new, $family));
        }

        if ($found !== []) {
            $edits[$path] = $found;
        }
    }

    return ['edits' => $edits, 'unresolved' => $unresolved];
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

    return $isClassConstant ? staticClass($first->class) : null;
}

/**
 * The class a static name stands for: self, static and parent read as the class written around it.
 */
function staticClass(Node\Name $name): string|null
{
    return in_array($name->toLowerString(), ['self', 'static'], true) ? enclosingClass($name) : $name->toString();
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
        $entry = $index[$line[$at]] ?? ['related' => [], $kind => []];

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
        1 => receiverType($given[0]->expr, $index),
        default => null,
    };
}

/**
 * The class a type declaration names, with self and static read as the class it is written in; null for a built-in,
 * a union or no type.
 */
function typeName(Node|null $type, string|null $self): string|null
{
    return match (true) {
        $type instanceof Node\NullableType => typeName($type->type, $self),
        $type instanceof Node\Name, $type instanceof Node\Identifier => in_array(strtolower($type->toString()), ['self', 'static'], true) ? $self : classTypeName($type),
        default => null,
    };
}

function classTypeName(Node\Name|Node\Identifier $type): string|null
{
    return $type instanceof Node\Name ? $type->toString() : null;
}

/**
 * The full name of the class, interface or trait the node is written in; null outside one.
 */
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
    for ($parent = $node->getAttribute('parent'); $parent instanceof Node; $parent = $parent->getAttribute('parent')) {
        if ($parent instanceof $kind) {
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
    bool $static = false,
): array {
    $sites = [];
    $inFamily = static fn (Node|null $class): bool => $class instanceof Node\Name && (isset($family[$class->toString()]) || in_array(
        $class->toLowerString(),
        ['self', 'static', 'parent'],
        true,
    ));

    if ($what === 'method' && $static) {
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
        $sites[] = [$named->getStartFilePos(), $named->getEndFilePos(), $new];
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
            $sites[] = [$argument->name->getStartFilePos(), $argument->name->getEndFilePos(), $new];
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
            $sites[] = [$variable->getStartFilePos(), $variable->getEndFilePos(), '$'.$new];
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
        $statements = $line > 0 ? closureScope($file['statements'], $path, $line, $old) : $file['statements'];

        foreach ($finder->find($statements, static fn (Node $node) => isVariableNamed($node, $old)) as $variable) {
            $found[] = [$variable->getStartFilePos(), $variable->getEndFilePos(), '$'.$new];
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
 * @param  list<Node>  $statements
 * @return list<Node>
 */
function closureScope(array $statements, string $path, int $line, string $parameter): array
{
    $finder = new NodeFinder();
    $closures = $finder->find(
        $statements,
        static fn (Node $node) => ($node instanceof Node\Expr\Closure || $node instanceof Node\Expr\ArrowFunction)
            && $node->getStartLine() === $line,
    );
    $function = $closures[0] ?? null;

    if (count($finder->findInstanceOf($closures, Node\FunctionLike::class)) !== 1
        || ! $function instanceof Node\FunctionLike
        || ! array_any($function->getParams(), static fn (Node\Param $param) => isVariableNamed($param->var, $parameter))
    ) {
        throw RenameRefused::closureParameterMissing($path, $line, $parameter);
    }

    return $closures;
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
        static fn (array $match) => [$doc->getStartFilePos() + $match[1], $doc->getStartFilePos() + $match[1] + strlen($match[0]) - 1, '$'.$new],
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
 * Lines whose string literals spell the old name, for a user to check.
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

    foreach (testCases() as [$why, $rename, $with, $before, $after, $refused, $unresolved]) {
        exec('rm -rf '.escapeshellarg($root));

        foreach ($before as $file => $code) {
            @mkdir(dirname($root.'/'.$file), 0777, true);
            file_put_contents($root.'/'.$file, $code);
        }

        try {
            $listed = renameMember($root, $rename, $with, false)['unresolved'];
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
    }

    exec('rm -rf '.escapeshellarg($root));
    printf("%d case(s), %d failed\n", count(testCases()), $failed);

    return $failed > 0 ? 1 : 0;
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

    return [
        ['a property, its promoted parameter, accesses and named arguments', [
            'property',
            'App\\Ids\\Identity',
            'kind',
            'type',
        ], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            ['app/Ids/Identity.php' => str_replace(
                ['public string $kind', '$this->check($kind)', '@param  string  $kind', '$this->kind', '$other->kind'],
                ['public string $type', '$this->check($type)', '@param  string  $type', '$this->type', '$other->type'],
                $identity,
            ),
                'app/Use/run.php' => str_replace(
                    ['$one->kind', 'kind: \'a\''],
                    ['$one->type', 'type: \'a\''],
                    $user,
                )], false, []],
        ['a method and its calls', ['method', 'App\\Ids\\Identity', 'isSameAs', 'matches'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            [
                'app/Ids/Identity.php' => str_replace('function isSameAs', 'function matches', $identity),
                'app/Use/run.php' => str_replace('->isSameAs(', '->matches(', $user),
            ], false, []],
        ['a constant and its fetches', ['constant', 'App\\Ids\\Identity', 'KIND_COUNT', 'TYPE_COUNT'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            [
                'app/Ids/Identity.php' => str_replace('KIND_COUNT', 'TYPE_COUNT', $identity),
                'app/Use/run.php' => str_replace('KIND_COUNT', 'TYPE_COUNT', $user),
            ], false, []],
        ['a variable in a folder, its parameter and its @param line', ['variable', 'app/Use', 'kind', 'type'], [],
            ['app/Ids/Identity.php' => $identity, 'app/Use/run.php' => $user],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Use/run.php' => str_replace(['$kind = ', '? $kind.'], ['$type = ', '? $type.'], $user),
            ], false, []],
        ['a variable in one file leaves its neighbour alone', ['variable', 'app/Use/one.php', 'count', 'itemCount'], [],
            ['app/Use/one.php' => $closures, 'app/Use/two.php' => $closures],
            [
                'app/Use/one.php' => str_replace('$count', '$itemCount', $closures),
                'app/Use/two.php' => $closures,
            ], false, []],
        ['a variable in one closure leaves its neighbour alone', [
            'variable',
            'app/Use/one.php:2',
            'count',
            'copyCount',
        ], [],
            ['app/Use/one.php' => $closures], ['app/Use/one.php' => $renamedClosure], false, []],
        ['a closure rename refuses a malformed line', ['variable', 'app/Use/one.php:line', 'count', 'copyCount'], [],
            ['app/Use/one.php' => $closures], ['app/Use/one.php' => $closures], true, []],
        ['a closure rename refuses a name outside its parameters', [
            'variable',
            'app/Use/one.php:2',
            'join',
            'joinText',
        ], [],
            ['app/Use/one.php' => $closures], ['app/Use/one.php' => $closures], true, []],
        ['a property another class also declares is renamed on the receivers of its own class', [
            'property',
            'App\\Ids\\Identity',
            'kind',
            'type',
        ], [],
            [
                'app/Ids/Identity.php' => $identity,
                'app/Ids/Other.php' => $other,
            ],
            [
                'app/Ids/Identity.php' => str_replace(
                    ['public string $kind', '$this->check($kind)', '@param  string  $kind', '$this->kind', '$other->kind'],
                    ['public string $type', '$this->check($type)', '@param  string  $type', '$this->type', '$other->type'],
                    $identity,
                ),
                'app/Ids/Other.php' => $other,
            ], false, []],
        ['a method another class also declares is renamed by its receiver, and an unknown receiver is listed', [
            'method',
            'App\\Units\\Owner',
            'own',
            'claim',
        ], [],
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
            ], false, ['app/Use/Work.php:15']],
        ['a static method is renamed only at the calls of its own class',
            ['method', 'App\\Ids\\Note', 'keep', 'create'], [],
            [
                'app/Ids/Note.php' => "<?php\nnamespace App\\Ids;\nfinal class Note\n{\n    public static function keep(): self\n    {\n        return new self();\n    }\n\n    public static function again(): self\n    {\n        return self::keep();\n    }\n}\n",
                'app/Ids/Ledger.php' => "<?php\nnamespace App\\Ids;\nfinal class Ledger\n{\n    public static function keep(): self\n    {\n        return self::keep();\n    }\n}\n",
                'app/Use/note.php' => "<?php\nuse App\\Ids\\Ledger;\nuse App\\Ids\\Note;\nNote::keep();\nLedger::keep();\n",
            ],
            [
                'app/Ids/Note.php' => "<?php\nnamespace App\\Ids;\nfinal class Note\n{\n    public static function create(): self\n    {\n        return new self();\n    }\n\n    public static function again(): self\n    {\n        return self::create();\n    }\n}\n",
                'app/Ids/Ledger.php' => "<?php\nnamespace App\\Ids;\nfinal class Ledger\n{\n    public static function keep(): self\n    {\n        return self::keep();\n    }\n}\n",
                'app/Use/note.php' => "<?php\nuse App\\Ids\\Ledger;\nuse App\\Ids\\Note;\nNote::create();\nLedger::keep();\n",
            ], false, []],
        ['naming the other class with --with renames both', [
            'property',
            'App\\Ids\\Identity',
            'kind',
            'type',
        ], ['App\\Ids\\Other'],
            [
                'app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$kind = '';\n}\n",
                'app/Ids/Identity.php' => $identity,
            ],
            [
                'app/Ids/Other.php' => "<?php\nnamespace App\\Ids;\nfinal class Other\n{\n    public string \$type = '';\n}\n",
            ], false, []],
    ];
}
