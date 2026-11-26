<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Actors\CurrentActor;
use App\Support\ActorReference;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use Illuminate\Container\Attributes\Bind;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Container\Attributes\Singleton;
use PhpParser\Node;
use PhpParser\Node\Expr\ClassConstFetch;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\ScanCache;

/**
 * Judges the container bindings the code states: no interface names its implementation with #[Bind], since its
 * area's service provider binds it; a #[Bind] target and a provider's class-string binding implement what they are
 * bound to and belong to the owner that binds them, and no singleton keeps a per-request service alive
 * beyond its request. A binding made by a closure is not judged: what it builds cannot be read from the code.
 */
final readonly class BindingRules
{
    /**
     * The owner of a name no area or package of the journal holds, such as a framework's.
     */
    private const string NO_OWNER = 'no owner';

    private const array BINDING_METHODS = ['bind', 'bindIf', 'scoped', 'scopedIf', 'singleton', 'singletonIf'];

    private const array SINGLETON_METHODS = ['singleton', 'singletonIf'];

    private const array SCOPED_METHODS = ['scoped', 'scopedIf'];

    /**
     * Values of one request that Core builds by a closure on each resolution, and the contract of the request's actor,
     * whose scoped store Core's provider binds, so they are per-request wherever the provider is not judged.
     */
    private const array PER_REQUEST_VALUES = [ActorReference::class, CurrentActor::class];

    /**
     * @param  list<PublicOwner>  $owners
     * @param  list<string>  $files  every file of the owners, providers included
     */
    public function __construct(
        private array $owners,
        private array $files,
    ) {}

    /**
     * @return list<Violation>
     */
    public function violations(): array
    {
        $definitions = $this->definitions();
        $violations = [];

        foreach ($definitions as $definition) {
            array_push($violations, ...$this->violationsOf($definition));
        }

        foreach ($definitions as $definition) {
            if ($definition->isSingleton) {
                array_push($violations, ...$this->capturedScopedServices($definition, $definitions));
            }
        }

        return $violations;
    }

    /**
     * @return list<Violation>
     */
    private function violationsOf(BindingDefinition $definition): array
    {
        if ($definition->concrete === null) {
            return [];
        }

        $userOwner = $this->ownerNameOf($definition->file);
        $abstractOwner = $this->ownerNameOfClass($definition->abstract);
        $concreteOwner = $this->ownerNameOfClass($definition->concrete);

        if (! str_ends_with($definition->file, 'ServiceProvider.php')
            && self::exists($definition->abstract)
            && Reflector::of($definition->abstract)->isInterface()) {
            return [
                $definition->violation(
                    $userOwner,
                    $abstractOwner,
                    "an interface names no implementation; its area's service provider binds it",
                ),
            ];
        }

        if (! self::exists($definition->abstract)
            || ! Reflector::factory()->is($definition->concrete, $definition->abstract)) {
            return [
                $definition->violation($userOwner, $abstractOwner, "{$definition->concrete} does not implement it"),
            ];
        }

        if ($concreteOwner !== $userOwner) {
            return [
                $definition->violation(
                    $userOwner,
                    $concreteOwner,
                    "the target {$definition->concrete} belongs to {$concreteOwner}",
                ),
            ];
        }

        // A framework's own contract, such as Fortify's LogoutResponse, is filled by the owner that uses it.
        if ($abstractOwner !== $userOwner
            && $abstractOwner !== self::NO_OWNER
            && ! ($abstractOwner === 'Core' && $this->isCoreExport($definition->abstract))) {
            return [
                $definition->violation(
                    $userOwner,
                    $abstractOwner,
                    "{$abstractOwner} owns it; only Core's public contracts are filled by another owner",
                ),
            ];
        }

        return [];
    }

    /**
     * The per-request services a singleton reaches through its constructor, following #[Bind] targets.
     *
     * @param  list<BindingDefinition>  $definitions
     * @return list<Violation>
     */
    private function capturedScopedServices(BindingDefinition $singleton, array $definitions): array
    {
        $scoped = [
            ...self::PER_REQUEST_VALUES,
            ...array_map(
                fn (BindingDefinition $definition) => $definition->abstract,
                array_values(
                    array_filter($definitions, fn (BindingDefinition $definition) => $definition->isScoped),
                ),
            ),
        ];
        $class = $singleton->concrete ?? $singleton->abstract;
        $captured = $this->firstScopedDependency($class, $scoped, []);

        if ($captured === null) {
            return [];
        }

        return [
            $singleton->violation(
                $this->ownerNameOf($singleton->file),
                $this->ownerNameOfClass($captured),
                "the singleton {$class} keeps the per-request {$captured} beyond its request",
            ),
        ];
    }

    /**
     * @param  list<string>  $scoped
     * @param  list<string>  $visited
     */
    private function firstScopedDependency(string $class, array $scoped, array $visited): string|null
    {
        if (! self::exists($class) || ! Reflector::of($class)->isClass() || in_array($class, $visited, true)) {
            return null;
        }

        $parameters = Reflector::of($class)->constructor()
            ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
            ->getOrElse([]);

        foreach ($parameters as $parameter) {
            $type = $parameter->type()
                ->filter(fn (DeclaredType $declared) => $declared->isNamed() && ! $declared->isBuiltin());

            if ($type->isEmpty()) {
                continue;
            }

            $dependency = $type->get()->name();
            $target = self::bindTargetOf($dependency) ?? $dependency;

            if (in_array($dependency, $scoped, true)
                || in_array($target, $scoped, true)
                || self::isScopedClass($target)) {
                return $dependency;
            }

            $found = $this->firstScopedDependency($target, $scoped, [...$visited, $class]);

            if ($found !== null) {
                return $found;
            }
        }

        return null;
    }

    /**
     * Every binding the owners state: #[Bind], #[Scoped] and #[Singleton] attributes, and class-string calls in
     * providers.
     *
     * @return list<BindingDefinition>
     */
    private function definitions(): array
    {
        $definitions = [];

        foreach (ScanCache::findings(new BindingDefinitionScan(), $this->files) as $definition) {
            $definitions[] = $definition;
        }

        return $definitions;
    }

    /**
     * The bindings one file registers, through an attribute or a provider call.
     *
     * @return list<BindingDefinition>
     */
    public static function definitionsIn(ParsedFile $file): array
    {
        return [...self::attributeDefinitions($file), ...self::providerDefinitions($file)];
    }

    /**
     * @return list<BindingDefinition>
     */
    private static function attributeDefinitions(ParsedFile $file): array
    {
        $definitions = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, ClassLike::class) as $type) {
            $name = $type->namespacedName?->toString();

            if ($name === null || ! self::exists($name)) {
                continue;
            }

            $class = Reflector::of($name);
            $line = $type->getStartLine();
            $isScoped = $class->hasAttribute(Scoped::class);
            $isSingleton = $class->hasAttribute(Singleton::class);
            $target = self::bindTargetOf($name);

            if ($target !== null || $isScoped || $isSingleton) {
                $definitions[] = new BindingDefinition(
                    $file->path,
                    $line,
                    $name,
                    $target,
                    $isScoped || self::isScopedClass($target),
                    $isSingleton,
                );
            }
        }

        return $definitions;
    }

    /**
     * @return list<BindingDefinition>
     */
    private static function providerDefinitions(ParsedFile $file): array
    {
        if (! str_ends_with($file->path, 'ServiceProvider.php')) {
            return [];
        }

        $definitions = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, MethodCall::class) as $call) {
            $method = $call->name instanceof Node\Identifier ? $call->name->toString() : '';

            if (! in_array($method, self::BINDING_METHODS, true) || $call->isPartialFunctionApplication()) {
                continue;
            }

            $abstract = self::classStringOf($call->getArgs()[0]->value ?? null);

            if ($abstract === null) {
                continue;
            }

            $concrete = self::classStringOf($call->getArgs()[1]->value ?? null);
            $definitions[] = new BindingDefinition(
                $file->path,
                $call->getStartLine(),
                $abstract,
                $concrete,
                in_array($method, self::SCOPED_METHODS, true),
                in_array($method, self::SINGLETON_METHODS, true),
            );
        }

        return $definitions;
    }

    private static function classStringOf(Node|null $argument): string|null
    {
        if (! $argument instanceof ClassConstFetch
            || ! $argument->class instanceof Name
            || ! $argument->name instanceof Node\Identifier
            || $argument->name->toString() !== 'class') {
            return null;
        }

        return $argument->class->toString();
    }

    private static function bindTargetOf(string $name): string|null
    {
        if (! self::exists($name)) {
            return null;
        }

        return Reflector::of($name)->attributes(Bind::class)->first()
            ->map(fn (Bind $bind) => $bind->concrete)
            ->getOrElse(null);
    }

    private static function isScopedClass(string|null $name): bool
    {
        return $name !== null && self::exists($name) && Reflector::of($name)->hasAttribute(Scoped::class);
    }

    private function isCoreExport(string $name): bool
    {
        return array_any($this->owners, fn (PublicOwner $owner) => $owner->isCore() && $owner->exportsName($name));
    }

    private function ownerNameOf(string $file): string
    {
        $namespace = self::namespaceOf($file);

        return $this->ownerNameOfClass($namespace.'\\File');
    }

    private function ownerNameOfClass(string $name): string
    {
        return array_find($this->owners, fn (PublicOwner $owner) => $owner->ownsName($name))->name ?? self::NO_OWNER;
    }

    private static function namespaceOf(string $file): string
    {
        return ScanCache::findings(new NamespacesDeclared(), [$file])[0]['name'] ?? '';
    }

    /**
     * @phpstan-assert-if-true class-string $name
     */
    private static function exists(string $name): bool
    {
        return Reflector::exists($name) && ! Reflector::of($name)->isTrait();
    }
}
