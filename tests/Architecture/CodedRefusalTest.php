<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Reflection\Support\Reflector;
use Tests\Architecture\Support\DomainFiles;
use Tests\Fixtures\Architecture\Refusals\UncodedRefusal;
use Tests\TestCase;

/**
 * Every refusal a route renders carries a refusal code (doc 50, section 10), so a caller can act on it without
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
        return array_values(array_filter($classes, fn (string $class) => Reflector::find($class)
            ->filter(fn (Reflector $type) => $type->isClass())
            ->filter(fn (Reflector $type) => array_any(
                $type->traits(),
                fn (Reflector $trait) => $trait->name() === RendersRefusal::class,
            ))
            ->filter(fn (Reflector $type) => ! $type->isSubclassOf(CodedRefusal::class))
            ->isDefined()));
    }
}
