<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Support\ReflectedType;
use Tests\Architecture\Support\DomainFiles;
use Tests\Fixtures\Architecture\Refusals\UncodedRefusal;

/**
 * Every refusal a route renders carries a refusal code, so a caller can act on it without
 * reading the message.
 */
final class CodedRefusalTest extends TestCase
{
    public function test_every_rendered_refusal_carries_a_code(): void
    {
        $this->assertSame([], self::uncodedAmong(self::declaredClasses()));
    }

    public function test_a_refusal_without_a_code_is_found(): void
    {
        $this->assertSame([UncodedRefusal::class], self::uncodedAmong([UncodedRefusal::class]));
    }

    /**
     * Every class declared in app and the domains' code.
     *
     * @return list<string>
     */
    private static function declaredClasses(): array
    {
        $classes = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            $source = (string) file_get_contents($file);
            $namespace = preg_match('/^namespace ([^;]+);/m', $source, $namespaceMatch) === 1;
            $name = preg_match('/^(?:final |abstract )?(?:readonly )?class (\w+)/m', $source, $nameMatch) === 1;

            if ($namespace && $name) {
                $classes[] = $namespaceMatch[1].'\\'.$nameMatch[1];
            }
        }

        return $classes;
    }

    /**
     * @param  list<string>  $classes
     * @return list<string>
     */
    private static function uncodedAmong(array $classes): array
    {
        return array_values(array_filter($classes, fn (string $class) => ReflectedType::find($class)
            ->filter(fn (ReflectedType $type) => $type->isClass())
            ->filter(fn (ReflectedType $type) => array_any(
                $type->traits(),
                fn (ReflectedType $trait) => $trait->name() === RendersRefusal::class,
            ))
            ->filter(fn (ReflectedType $type) => ! $type->isSubclassOf(CodedRefusal::class))
            ->isDefined()));
    }
}
