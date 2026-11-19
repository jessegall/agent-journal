<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Actors\Support\ActorContext;
use Illuminate\Container\Attributes\Bind;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Container\Attributes\Singleton;
use PhpParser\Node;
use PhpParser\Node\Expr\ClassConstFetch;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\NodeFinder;
use ReflectionClass;
use ReflectionNamedType;
use Tests\Support\ScanCache\ScanCache;

/**
 * Judges the container bindings the code states: a #[Bind] target and a provider's class-string binding implement
 * what they are bound to and belong to the owner that binds them, and no singleton keeps a per-request service alive
 * beyond its request. A binding made by a closure is not judged: what it builds cannot be read from the code.
 */
final readonly class BindingRules
{
    private const array BINDING_METHODS = ['bind', 'bindIf', 'scoped', 'scopedIf', 'singleton', 'singletonIf'];

    private const array SINGLETON_METHODS = ['singleton', 'singletonIf'];

    private const array SCOPED_METHODS = ['scoped', 'scopedIf'];

    /**
     * Values of one request that Core builds by a closure on each resolution, so no scoped binding names them.
     */
    private const array PER_REQUEST_VALUES = [ActorContext::class];

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
        $registrations = $this->registrations();
        $violations = [];

        foreach ($registrations as $registration) {
            array_push($violations, ...$this->violationsOf($registration));
        }

        foreach ($registrations as $registration) {
            if ($registration->isSingleton) {
                array_push($violations, ...$this->capturedScopedServices($registration, $registrations));
            }
        }

        return $violations;
    }

    /**
     * @return list<Violation>
     */
    private function violationsOf(BindingRegistration $registration): array
    {
        if ($registration->concrete === null) {
            return [];
        }

        $userOwner = $this->ownerNameOf($registration->file);
        $abstractOwner = $this->ownerNameOfClass($registration->abstract);
        $concreteOwner = $this->ownerNameOfClass($registration->concrete);

        if (! self::exists($registration->concrete) || ! is_a($registration->concrete, $registration->abstract, true)) {
            return [
                $registration->violation($userOwner, $abstractOwner, "{$registration->concrete} does not implement it"),
            ];
        }

        if ($concreteOwner !== $userOwner) {
            return [
                $registration->violation($userOwner, $concreteOwner, "the target {$registration->concrete} belongs to {$concreteOwner}"),
            ];
        }

        if ($abstractOwner !== $userOwner && ! ($abstractOwner === 'Core' && $this->isCoreExport($registration->abstract))) {
            return [
                $registration->violation($userOwner, $abstractOwner, "{$abstractOwner} owns it; only Core's public contracts are filled by another owner"),
            ];
        }

        return [];
    }

    /**
     * The per-request services a singleton reaches through its constructor, following #[Bind] targets.
     *
     * @param  list<BindingRegistration>  $registrations
     * @return list<Violation>
     */
    private function capturedScopedServices(BindingRegistration $singleton, array $registrations): array
    {
        $scoped = [
            ...self::PER_REQUEST_VALUES,
            ...array_map(
                fn (BindingRegistration $registration) => $registration->abstract,
                array_values(array_filter($registrations, fn (BindingRegistration $registration) => $registration->isScoped)),
            ),
        ];
        $class = $singleton->concrete ?? $singleton->abstract;
        $captured = $this->firstScopedDependency($class, $scoped, []);

        if ($captured === null) {
            return [];
        }

        return [
            $singleton->violation($this->ownerNameOf($singleton->file), $this->ownerNameOfClass($captured), "the singleton {$class} keeps the per-request {$captured} beyond its request"),
        ];
    }

    /**
     * @param  list<string>  $scoped
     * @param  list<string>  $visited
     */
    private function firstScopedDependency(string $class, array $scoped, array $visited): string|null
    {
        if (! class_exists($class) || in_array($class, $visited, true)) {
            return null;
        }

        foreach (new ReflectionClass($class)->getConstructor()?->getParameters() ?? [] as $parameter) {
            $type = $parameter->getType();

            if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
                continue;
            }

            $dependency = $type->getName();
            $target = self::bindTargetOf($dependency) ?? $dependency;

            if (in_array($dependency, $scoped, true) || in_array($target, $scoped, true) || self::isScopedClass($target)) {
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
     * Every binding the owners state: #[Bind], #[Scoped] and #[Singleton] attributes, and class-string calls in providers.
     *
     * @return list<BindingRegistration>
     */
    private function registrations(): array
    {
        $registrations = [];

        foreach (ScanCache::findings(new BindingRegistrationScan(), $this->files) as $registration) {
            $registrations[] = $registration;
        }

        return $registrations;
    }

    /**
     * The bindings one file registers, through an attribute or a provider call.
     *
     * @return list<BindingRegistration>
     */
    public static function registrationsIn(ParsedFile $file): array
    {
        return [...self::attributeRegistrations($file), ...self::providerRegistrations($file)];
    }

    /**
     * @return list<BindingRegistration>
     */
    private static function attributeRegistrations(ParsedFile $file): array
    {
        $registrations = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, ClassLike::class) as $type) {
            $name = $type->namespacedName?->toString();

            if ($name === null || ! self::exists($name)) {
                continue;
            }

            $class = new ReflectionClass($name);
            $line = $type->getStartLine();
            $isScoped = $class->getAttributes(Scoped::class) !== [];
            $isSingleton = $class->getAttributes(Singleton::class) !== [];
            $target = self::bindTargetOf($name);

            if ($target !== null || $isScoped || $isSingleton) {
                $registrations[] = new BindingRegistration(
                    $file->path,
                    $line,
                    $name,
                    $target,
                    $isScoped || self::isScopedClass($target),
                    $isSingleton,
                );
            }
        }

        return $registrations;
    }

    /**
     * @return list<BindingRegistration>
     */
    private static function providerRegistrations(ParsedFile $file): array
    {
        if (! str_ends_with($file->path, 'ServiceProvider.php')) {
            return [];
        }

        $registrations = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, MethodCall::class) as $call) {
            $method = $call->name instanceof Node\Identifier ? $call->name->toString() : '';
            $abstract = self::classStringOf($call->getArgs()[0]->value ?? null);

            if (! in_array($method, self::BINDING_METHODS, true) || $abstract === null) {
                continue;
            }

            $concrete = self::classStringOf($call->getArgs()[1]->value ?? null);
            $registrations[] = new BindingRegistration(
                $file->path,
                $call->getStartLine(),
                $abstract,
                $concrete,
                in_array($method, self::SCOPED_METHODS, true),
                in_array($method, self::SINGLETON_METHODS, true),
            );
        }

        return $registrations;
    }

    private static function classStringOf(Node|null $argument): string|null
    {
        if (! $argument instanceof ClassConstFetch || ! $argument->class instanceof Name || ! $argument->name instanceof Node\Identifier || $argument->name->toString() !== 'class') {
            return null;
        }

        return $argument->class->toString();
    }

    private static function bindTargetOf(string $name): string|null
    {
        if (! self::exists($name)) {
            return null;
        }

        $attribute = new ReflectionClass($name)->getAttributes(Bind::class)[0] ?? null;

        return $attribute?->newInstance()->concrete;
    }

    private static function isScopedClass(string|null $name): bool
    {
        return $name !== null && class_exists($name) && new ReflectionClass($name)->getAttributes(Scoped::class) !== [];
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
        return array_find($this->owners, fn (PublicOwner $owner) => $owner->ownsName($name))->name ?? 'no owner';
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
        return class_exists($name) || interface_exists($name);
    }
}
