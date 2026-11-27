<?php

declare(strict_types=1);

/**
 * The names the project's PHP code declares, read from its syntax trees: each type, member, parameter and local
 * variable, with whether it names an action, a question or an object (name-grammar.php).
 */

use App\Support\Reflector;
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

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/promoted-parameters.php';
require_once __DIR__.'/php-parse.php';
require_once __DIR__.'/name-grammar.php';

/**
 * One name the code declares: its declaration type, the name, where it is declared, and whether it names an action (a
 * method returning nothing, a step, command, listener or job), a question, an event, a name a vendor type gives, or an
 * object.
 */
final readonly class DeclaredName
{
    public function __construct(
        public string $declarationType,
        public string $name,
        public string $place,
        public string $role = 'thing',
        // The full name of the type a type or member name belongs to, which the renamers take; none for a local name.
        public string $owner = '',
    ) {}
}

/**
 * @param  list<string>  $files  PHP files
 * @return list<DeclaredName>
 */
function declaredNames(array $files): array
{
    $names = [];
    // The parents of the classes that use each trait: a trait's method overrides what those parents declare.
    $traitUserParents = [];

    foreach ($files as $path) {
        $statements = new NodeTraverser(new NameResolver())->traverse(parsedOnce($path, (string) file_get_contents($path)));

        foreach (new NodeFinder()->findInstanceOf($statements, ClassLike::class) as $type) {
            if ($type->name === null) {
                continue;
            }

            $typeName = $type->name->toString();
            $owner = $type->namespacedName?->toString() ?? $typeName;
            $parents = parentsOf($type);

            foreach (new NodeFinder()->findInstanceOf($type->stmts, Node\Stmt\TraitUse::class) as $use) {
                foreach ($use->traits as $trait) {
                    $traitUserParents[$trait->toString()] = [
                        ...$traitUserParents[$trait->toString()] ?? [],
                        ...$parents,
                    ];
                }
            }

            // A class in an action folder acts only when it has a method to call; one with none is the value it carries.
            $hasPublicMethod = array_any($type->getMethods(), fn ($method) => $method->isPublic() && $method->name->toString() !== '__construct');
            $isActionClass = preg_match(ACTION_FOLDERS, $path) === 1 && ! str_ends_with($typeName, 'Test')
                && ! ($type instanceof Class_ && $type->isAbstract()) && $hasPublicMethod;
            $typeRole = match (true) {
                $isActionClass => 'action',
                $type instanceof Class_ && array_any($parents, fn (string $parent) => str_ends_with($parent, 'Event')) => 'event',
                $type instanceof Class_ && array_any($parents, fn (string $parent) => str_ends_with($parent, 'AgentState')) => 'state',
                default => 'thing',
            };
            $names[] = new DeclaredName(declarationTypeOf($type), $typeName, "{$path}:{$type->getStartLine()}", $typeRole, $owner);

            foreach ($type->stmts as $member) {
                foreach (membersOf($member) as [$declarationType, $name, $role]) {
                    $isOverride = $declarationType === 'method' && overridesVendor(rtrim($name, '()'), $parents);
                    $names[] = new DeclaredName(
                        $declarationType,
                        "{$typeName}::{$name}",
                        "{$path}:{$member->getStartLine()}",
                        $isOverride ? 'override' : $role,
                        $owner,
                    );
                }
            }
        }

        array_push($names, ...localNamesOf($statements, $path));
    }

    return array_map(fn (DeclaredName $declared) => isTraitOverride($declared, $traitUserParents)
        ? new DeclaredName($declared->declarationType, $declared->name, $declared->place, 'override', $declared->owner)
        : $declared, $names);
}

/**
 * Whether a method is a model's query scope, which names the rows it narrows to (turnsApplyingSince), not a command.
 */
function isQueryScope(ClassMethod $method): bool
{
    return array_any($method->attrGroups, fn ($group) => array_any($group->attrs, fn ($attribute) => $attribute->name->getLast() === 'Scope'));
}

/**
 * Whether a trait's method keeps a name a vendor parent of a class using the trait declares.
 *
 * @param  array<string, list<string>>  $traitUserParents
 */
function isTraitOverride(DeclaredName $declared, array $traitUserParents): bool
{
    return $declared->declarationType === 'method' && isset($traitUserParents[$declared->owner])
        && overridesVendor(rtrim(substr($declared->name, (int) strpos($declared->name, '::') + 2), '()'), $traitUserParents[$declared->owner]);
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

    $roles = [];

    foreach ($finder->findInstanceOf($statements, Node\Param::class) as $parameter) {
        if ($parameter->var instanceof Node\Expr\Variable && is_string($parameter->var->name)) {
            $parameters['$'.$parameter->var->name] ??= $parameter->getStartLine();
            $roles['$'.$parameter->var->name] ??= roleOfType($parameter->type, returns: false);
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
            fn (string $name, int $line) => new DeclaredName('parameter', $name, "{$path}:{$line}", $roles[$name]),
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

/**
 * Whether a declared type makes a name a question (bool), an action (void or never) or leaves it an object.
 */
function roleOfType(Node|null $type, bool $returns): string
{
    $name = $type instanceof Node\Identifier ? $type->toLowerString() : '';

    return match (true) {
        $name === 'bool' => 'question',
        $returns && in_array($name, ['void', 'never'], true) => 'action',
        default => 'thing',
    };
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
 * @return list<array{string, string, string}>
 */
function membersOf(Node $member): array
{
    return match (true) {
        $member instanceof ClassMethod => [
            [
                'method',
                $member->name->toString().'()',
                isQueryScope($member) ? 'thing' : roleOfType($member->returnType, returns: true),
            ],
            ...promotedProperties($member),
        ],
        $member instanceof Property => array_map(
            fn ($property) => [
                'property',
                '$'.$property->name->toString(),
                roleOfType($member->type, returns: false),
            ],
            $member->props,
        ),
        $member instanceof ClassConst => array_map(fn ($constant) => [
            'constant',
            $constant->name->toString(),
            'thing',
        ], $member->consts),
        $member instanceof EnumCase => [[
            'case',
            $member->name->toString(),
            'thing',
        ]],
        default => [],
    };
}

/**
 * @return list<array{string, string, string}>
 */
function promotedProperties(ClassMethod $method): array
{
    $properties = [];

    foreach ($method->params as $param) {
        if (isPromoted($param)) {
            $properties[] = [
                'property',
                '$'.$param->var->name,
                roleOfType($param->type, returns: false),
            ];
        }
    }

    return $properties;
}

/**
 * The types a type extends or implements, by their full names.
 *
 * @return list<string>
 */
function parentsOf(ClassLike $type): array
{
    $parents = match (true) {
        $type instanceof Class_ => [
            ...($type->extends === null ? [] : [$type->extends]),
            ...$type->implements,
        ],
        $type instanceof Interface_ => $type->extends,
        $type instanceof Enum_ => $type->implements,
        default => [],
    };

    return array_map(fn (Node\Name $name) => $name->toString(), $parents);
}

/**
 * Whether a method keeps the name a vendor type gives it (a cast's get, an iterator's getIterator), which the project
 * cannot rename: one of the parents declares it, through a class outside the project's namespaces.
 *
 * @param  list<string>  $parents
 */
function overridesVendor(string $method, array $parents): bool
{
    foreach ($parents as $parent) {
        if (! Reflector::exists($parent)) {
            continue;
        }

        $type = Reflector::of($parent);

        if (! $type->hasMethod($method)) {
            continue;
        }

        $declaring = $type->method($method)->declaringClass()->name();

        if (preg_match('/^(App|Domain|Tests|Database)\\\\/', $declaring) !== 1) {
            return true;
        }
    }

    return false;
}
