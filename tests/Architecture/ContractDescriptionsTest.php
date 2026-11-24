<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\ReflectedMethod;
use App\Support\Reflector;
use LogicException;
use Tests\Architecture\Support\ClassesDeclared;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\InterfacesDeclared;
use Tests\Fixtures\ContractDescriptions\UndescribedContract;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every method an interface or an abstract class declares has a short description above it, so a class that
 * implements or extends it knows when the method is called or what it answers; an override needs none.
 */
#[TimeLimit(seconds: 60, reason: 'It reads every class of app and the domains.')]
final class ContractDescriptionsTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/ContractDescriptions/UndescribedContract.php';

    private const string HOW_TO_FIX = 'Describe each of these methods in a doc comment of one or two lines: ';

    public function test_every_method_of_an_interface_or_abstract_class_is_described(): void
    {
        $undescribed = $this->undescribedIn(DomainFiles::in([app_path(), ...DomainFiles::domainCode()]));

        $this->assertSame([], $undescribed, self::HOW_TO_FIX.implode("\n", $undescribed));
    }

    public function test_a_method_without_a_description_is_found(): void
    {
        $this->assertSame([UndescribedContract::class.'::count'], $this->undescribedIn([base_path(self::FIXTURE)]));
    }

    /**
     * @param  list<string>  $files
     * @return list<string> each undescribed method as Class::method
     */
    private function undescribedIn(array $files): array
    {
        $types = [
            ...ScanCache::findings(new InterfacesDeclared(), $files),
            ...ScanCache::findings(new ClassesDeclared(), $files),
        ];
        $undescribed = [];

        foreach ($types as $name) {
            $type = Reflector::find($name)->getOrThrow(new LogicException("{$name} does not load."));

            if (! $type->isInterface() && ! ($type->isAbstract() && $type->isClass())) {
                continue;
            }

            foreach ($type->methods() as $method) {
                if ($this->needsDescription($method, $type)) {
                    $undescribed[] = "{$name}::{$method->name()}";
                }
            }
        }

        sort($undescribed);

        return $undescribed;
    }

    /**
     * @param  Reflector<object>  $type
     */
    private function needsDescription(ReflectedMethod $method, Reflector $type): bool
    {
        return $method->declaringClass()->name() === $type->name()
            && ! $method->isPrivate()
            && $method->docComment()->isEmpty()
            && ! $this->overridesAParent($method, $type);
    }

    /**
     * @param  Reflector<object>  $type
     */
    private function overridesAParent(ReflectedMethod $method, Reflector $type): bool
    {
        $others = [...array_slice($type->lineage(), 1), ...$type->interfaces()];

        return array_any($others, fn (Reflector $other) => $other->hasMethod($method->name()));
    }
}
