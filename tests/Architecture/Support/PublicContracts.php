<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Comments\Models\Comment;
use App\Comments\Support\HasComments;
use App\Exports\Support\Exports;
use App\Links\Support\LinkAccess;
use App\Reads\Support\ReadBuilder;
use Illuminate\Database\Eloquent\Model;
use PhpParser\Node;
use PhpParser\Node\Name;
use PhpParser\Node\Param;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Property;
use PhpParser\NodeFinder;
use ReflectionClass;
use Throwable;

/**
 * Judges what each owner exports: every export exists, is a type of type an owner may publish, and shows in its public
 * signatures only the owner's own exports, Core's public types and code outside the project.
 */
final readonly class PublicContracts
{
    /**
     * Core's Eloquent adapters: LinkAccess holds the model whose links it reads and hands back the caller's own query,
     * ReadBuilder bounds a domain's reads, and HasComments gives a Commentable model its comments relation, while
     * domains read comment content only through CommentResolver.
     */
    private const array CORE_ELOQUENT_ADAPTERS = [LinkAccess::class, ReadBuilder::class, HasComments::class];

    /**
     * The one member allowed to name a private Core model in its signature: the comments relation that HasComments
     * supplies returns the private Comment model.
     */
    private const array PRIVATE_RELATION_RESULTS = [HasComments::class => ['HasComments::comments()', Comment::class]];

    /**
     * @param  list<PublicOwner>  $owners
     */
    public function __construct(
        private array $owners,
        private ProjectRoots $roots,
    ) {}

    /**
     * @return list<Violation>
     */
    public function violations(): array
    {
        $violations = [];

        foreach ($this->owners as $owner) {
            foreach (self::listsOf($owner->exports) as $list => $exports) {
                foreach ($exports as $export) {
                    array_push($violations, ...$this->violationsOf($export, $owner, $list));
                }
            }
        }

        return $violations;
    }

    /**
     * Each export list by its name.
     *
     * @return array<string, list<class-string>>
     */
    private static function listsOf(Exports $exports): array
    {
        return [
            'events' => $exports->events,
            'contracts' => $exports->contracts,
            'values' => $exports->values,
            'commands' => $exports->commands,
            'exceptions' => $exports->exceptions,
            'support' => $exports->support,
        ];
    }

    /**
     * @return list<Violation>
     */
    private function violationsOf(string $export, PublicOwner $owner, string $list): array
    {
        if (! self::exists($export)) {
            return [
                new Violation(
                    '',
                    0,
                    $export,
                    $owner->name,
                    $owner->name,
                    ViolationType::DisallowedCategory,
                    "a name that does not exist, under {$list}",
                ),
            ];
        }

        $class = new ReflectionClass($export);
        $file = (string) $class->getFileName();
        $category = self::disallowedCategoryOf($class, $owner);

        if ($category !== null) {
            return [
                new Violation(
                    $file,
                    (int) $class->getStartLine(),
                    $export,
                    $owner->name,
                    $owner->name,
                    ViolationType::DisallowedCategory,
                    "{$category}, under {$list}",
                ),
            ];
        }

        $violations = [];

        foreach ($this->signatureNamesOf($class) as $path) {
            $leakOwner = $this->privateOwnerOf($path->name, $owner, $export);

            if ($leakOwner !== null && ! self::isAllowedRelationResult($export, $path->member, $path->name)) {
                $violations[] = new Violation(
                    $path->file,
                    $path->line,
                    $path->name,
                    $owner->name,
                    $leakOwner,
                    ViolationType::PrivateTypeInSignature,
                    $path->member,
                );
            }
        }

        return $violations;
    }

    /**
     * What makes an export unpublishable, or null for an interface, an enum, an immutable value without hidden state,
     * a Core trait, abstract base or Eloquent adapter, or an exception in the owner's own Exceptions folder.
     *
     * @param  ReflectionClass<object>  $class
     */
    private static function disallowedCategoryOf(ReflectionClass $class, PublicOwner $owner): string|null
    {
        if ($class->isInterface() || $class->isEnum()) {
            return null;
        }

        if ($class->isSubclassOf(Throwable::class)) {
            return str_ends_with(
                $class->getNamespaceName(),
                '\\Exceptions',
            ) ? null : 'an exception outside its owner\'s Exceptions folder';
        }

        if ($class->isSubclassOf(Model::class)) {
            return 'an Eloquent model';
        }

        $isCoreBase = $class->isTrait()
            || $class->isAbstract()
            || in_array($class->getName(), self::CORE_ELOQUENT_ADAPTERS, true);

        if ($owner->isCore() && $isCoreBase) {
            return null;
        }

        if ($class->isTrait() || $class->isAbstract()) {
            return 'a trait or an abstract class, which only Core publishes';
        }

        return self::isImmutableValue($class) ? null : 'a class with hidden or changeable state, such as a service';
    }

    /**
     * A final value whose own properties are all public and read-only or computed: a fact or a Data value, never a
     * service.
     *
     * @param  ReflectionClass<object>  $class
     */
    private static function isImmutableValue(ReflectionClass $class): bool
    {
        if (! $class->isFinal()) {
            return false;
        }

        $ownProperties = array_filter(
            $class->getProperties(),
            fn ($property) => $property->getDeclaringClass()->getName() === $class->getName(),
        );

        return array_all(
            $ownProperties,
            fn ($property) => $property->isPublic() && ($property->isReadOnly() || $property->isVirtual()),
        );
    }

    /**
     * Every class name the public members of a type and of its project parents show, with the member that shows it.
     *
     * @param  ReflectionClass<object>  $class
     * @return list<PublicTypePath>
     */
    private function signatureNamesOf(ReflectionClass $class): array
    {
        $paths = [];

        foreach ($this->projectLineageOf($class) as $declaring) {
            array_push($paths, ...self::publicNamesIn((string) $declaring->getFileName(), $declaring->getShortName()));
        }

        return $paths;
    }

    /**
     * The type itself and the parents and interfaces it takes from the project; framework parents are not judged.
     *
     * @param  ReflectionClass<object>  $class
     * @return list<ReflectionClass<object>>
     */
    private function projectLineageOf(ReflectionClass $class): array
    {
        $lineage = [$class];

        $parent = $class->getParentClass();

        while ($parent !== false) {
            if ($this->roots->startsWithProjectNamespace($parent->getName())) {
                $lineage[] = $parent;
            }

            $parent = $parent->getParentClass();
        }

        return $lineage;
    }

    /**
     * @return list<PublicTypePath>
     */
    private static function publicNamesIn(string $path, string $shortName): array
    {
        $file = ParsedFile::fromPath($path);
        $type = new NodeFinder()->findFirst(
            $file->statements,
            fn (Node $node) => $node instanceof ClassLike && $node->name?->toString() === $shortName,
        );

        if (! $type instanceof ClassLike) {
            return [];
        }

        $docblockUses = DocblockScan::of($file);
        $paths = self::docblockNames($docblockUses, $type, $path, $shortName);

        foreach ($type->stmts as $member) {
            array_push(
                $paths,
                ...self::memberNames($member, $docblockUses, $path, $shortName, $type instanceof Node\Stmt\Interface_),
            );
        }

        return $paths;
    }

    /**
     * @param  list<NameUse>  $docblockUses
     * @return list<PublicTypePath>
     */
    private static function memberNames(
        Node $member,
        array $docblockUses,
        string $path,
        string $shortName,
        bool $isInterface,
    ): array {
        if ($member instanceof ClassMethod && ($member->isPublic() || $isInterface)) {
            $memberPath = "{$shortName}::{$member->name}()";
            $types = [$member->returnType, ...array_map(fn (Param $param) => $param->type, $member->params)];
            $promoted = $member->name->toString() === '__construct' ? self::promotedNames(
                $member,
                $docblockUses,
                $path,
                $shortName,
            ) : [];

            return [
                ...self::typeNames($types, $path, $memberPath),
                ...self::docblockNames($docblockUses, $member, $path, $memberPath),
                ...$promoted,
            ];
        }

        if ($member instanceof Property && $member->isPublic()) {
            $memberPath = $shortName.'::$'.$member->props[0]->name;

            return [
                ...self::typeNames([$member->type], $path, $memberPath),
                ...self::docblockNames($docblockUses, $member, $path, $memberPath),
            ];
        }

        return [];
    }

    /**
     * Constructor parameters promoted to public properties, which are part of the public shape.
     *
     * @param  list<NameUse>  $docblockUses
     * @return list<PublicTypePath>
     */
    private static function promotedNames(
        ClassMethod $constructor,
        array $docblockUses,
        string $path,
        string $shortName,
    ): array {
        $paths = [];

        foreach ($constructor->params as $param) {
            if (! $param->isPublic() || ! $param->var instanceof Node\Expr\Variable || ! is_string($param->var->name)) {
                continue;
            }

            array_push(
                $paths,
                ...self::docblockNames($docblockUses, $param, $path, $shortName.'::$'.$param->var->name),
            );
        }

        return $paths;
    }

    /**
     * @param  array<Node|null>  $types
     * @return list<PublicTypePath>
     */
    private static function typeNames(array $types, string $path, string $memberPath): array
    {
        $names = new NodeFinder()->findInstanceOf(array_values(array_filter($types)), Name::class);

        return array_values(array_map(
            fn (Name $name) => new PublicTypePath($path, $name->getStartLine(), $name->toString(), $memberPath),
            array_filter($names, fn (Name $name) => ! $name->isSpecialClassName()),
        ));
    }

    /**
     * The class names of the docblock written right above a node.
     *
     * @param  list<NameUse>  $docblockUses
     * @return list<PublicTypePath>
     */
    private static function docblockNames(array $docblockUses, Node $node, string $path, string $memberPath): array
    {
        $doc = $node->getDocComment();

        if ($doc === null) {
            return [];
        }

        $inDoc = array_filter(
            $docblockUses,
            fn (NameUse $use) => $use->line >= $doc->getStartLine() && $use->line <= $doc->getEndLine(),
        );

        return array_values(
            array_map(fn (NameUse $use) => new PublicTypePath($path, $use->line, $use->name, $memberPath), $inDoc),
        );
    }

    /**
     * The owner a shown name is private to, or null when the name may be shown: code outside the project, the
     * export itself, another export of its owner or a Core public type. A docblock template name exists nowhere and
     * is not a class.
     */
    private function privateOwnerOf(string $name, PublicOwner $owner, string $export): string|null
    {
        $name = ltrim($name, '\\');

        if (! $this->roots->startsWithProjectNamespace($name)
            || ! self::exists($name)
            || strcasecmp($name, $export) === 0) {
            return null;
        }

        $coreExports = array_any(
            $this->owners,
            fn (PublicOwner $candidate) => $candidate->isCore() && $candidate->exportsName($name),
        );

        if ($owner->exportsName($name) || $coreExports) {
            return null;
        }

        return array_find(
            $this->owners,
            fn (PublicOwner $candidate) => $candidate->ownsName($name),
        )->name ?? 'no owner';
    }

    /**
     * @phpstan-assert-if-true class-string $name
     */
    private static function exists(string $name): bool
    {
        return class_exists($name) || interface_exists($name) || enum_exists($name) || trait_exists($name);
    }

    /**
     * Whether a private type in a signature is the one relation result the comments trait may name.
     */
    private static function isAllowedRelationResult(string $export, string $member, string $name): bool
    {
        return (self::PRIVATE_RELATION_RESULTS[$export] ?? null) === [$member, $name];
    }
}
