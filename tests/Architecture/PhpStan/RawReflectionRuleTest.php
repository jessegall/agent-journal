<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Rules\Rule;
use PHPStan\Testing\RuleTestCase;

/**
 * Native reflection outside the wrapper is reported by its resolved name or its receiver's type, with the wrapper
 * method to use; the wrapper itself, an Eloquent row read, an unrelated factory and a comment pass, and a wrapper file
 * may use native reflection but not name it in a public signature.
 *
 * @extends RuleTestCase<RawReflectionRule>
 */
final class RawReflectionRuleTest extends RuleTestCase
{
    private const string CONSTRUCTION = 'Use ReflectedType::of($target), or reflect() of the Reflects trait.';

    private const string ATTRIBUTES = 'Use ReflectedType::attributes(X::class), attribute(X::class) or hasAttribute(X::class).';

    /**
     * @var list<string>
     */
    private array $wrapperFiles = RawReflectionRule::WRAPPER_FILES;

    public function test_native_reflection_is_reported_by_resolved_name_and_receiver_type(): void
    {
        $this->analyse([self::fixture('RawReflectionUses.php')], [
            ["new ReflectionClass\n".self::CONSTRUCTION, 18],
            ["new ReflectionMethod\n".self::CONSTRUCTION, 23],
            ["ReflectionProperty::getAttributes()\n".self::ATTRIBUTES, 28],
            ["ReflectionProperty::getAttributes()\n".self::ATTRIBUTES, 33],
            ["ReflectionAttribute::newInstance()\nUse ReflectedType::attribute(X::class), which builds the attribute.", 34],
            ["ReflectionNamedType type\nUse a Reflector or the answer it gives.", 38],
            ["instanceof ReflectionUnionType\n".self::CONSTRUCTION, 40],
            ["ReflectionMethod::createFromMethodName()\n".self::CONSTRUCTION, 45],
            ["new ReflectionClass\n".self::CONSTRUCTION, 52],
            [
                "getAttributes() on a receiver of unknown type\nUse an explicit type for the receiver, so the reflection check can decide.",
                57,
            ],
            ["new ReflectionProperty\n".self::CONSTRUCTION, 65],
            ["class_exists()\nUse ReflectedType::exists(\$name) and ReflectedType::of(\$name)->isClass().", 70],
            [
                "is_subclass_of()\nUse ReflectedType::of(\$target)->isSubclassOf(X::class) or ->implements(X::class).",
                71,
            ],
            ["method_exists()\nUse ReflectedType::of(\$target)->hasMethod(\$name).", 72],
            ["instanceof on a type held as a name\nUse ReflectedType::of(\$type)->isInstance(\$value).", 73],
        ]);
    }

    public function test_the_wrapper_an_eloquent_row_read_a_factory_and_a_comment_pass(): void
    {
        $this->analyse([self::fixture('RawReflectionControls.php'), self::fixture('RawReflectionFactory.php')], []);
    }

    public function test_a_wrapper_file_may_use_native_reflection_but_not_name_it_in_a_public_signature(): void
    {
        $this->wrapperFiles = ['tests/Fixtures/PhpStan/RawReflectionWrapper.php'];

        $this->analyse([self::fixture('RawReflectionWrapper.php')], [[
            "ReflectionClass in a public signature\nUse a private native handle and a public answer that names no native reflector.",
            32,
        ]]);
    }

    protected function getRule(): Rule
    {
        return new RawReflectionRule($this->createReflectionProvider(), $this->wrapperFiles);
    }

    private static function fixture(string $name): string
    {
        return dirname(__DIR__, 2)."/Fixtures/PhpStan/{$name}";
    }
}
