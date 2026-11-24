<?php

declare(strict_types=1);

namespace Tests\Unit\Reflection;

use App\Enums\InstallLineHold;
use App\Support\Reflector;
use PHPUnit\Framework\TestCase;

/**
 * Reflector::propertiesMatch compares two objects, of one class or of two, by the public properties both
 * declare, whole for a nested object unless a left-out path reaches inside it.
 */
final class ReflectorPropertiesMatchTest extends TestCase
{
    public function test_objects_of_two_classes_match_on_the_properties_both_declare(): void
    {
        $draft = $this->draft('Notes', 'sonnet', $this->policy('codex', 'drafted'));
        $saved = $this->saved('Saved notes', 'sonnet', $this->policy('codex', 'drafted'), 3);

        $this->assertTrue(Reflector::propertiesMatch($draft, $saved, ['label']));
    }

    public function test_a_different_value_or_nested_object_does_not_match(): void
    {
        $draft = $this->draft('Notes', 'sonnet', $this->policy('codex', 'drafted'));

        $this->assertFalse(Reflector::propertiesMatch(
            $draft,
            $this->saved('Notes', 'opus', $this->policy('codex', 'drafted'), 3),
        ));
        $this->assertFalse(Reflector::propertiesMatch(
            $draft,
            $this->saved('Notes', 'sonnet', $this->policy('claude-code', 'drafted'), 3),
        ));
    }

    public function test_a_left_out_path_skips_a_property_and_a_dotted_one_a_nested_property(): void
    {
        $draft = $this->draft('Notes', 'sonnet', $this->policy('codex', 'drafted'));
        $saved = $this->saved('Other', 'sonnet', $this->policy('codex', 'imported'), 3);

        $this->assertFalse(Reflector::propertiesMatch($draft, $saved, ['label']));
        $this->assertTrue(Reflector::propertiesMatch($draft, $saved, ['label', 'policy.origin']));
    }

    public function test_enums_are_compared_by_identity(): void
    {
        $off = new readonly class(InstallLineHold::SwitchedOff)
        {
            public function __construct(public InstallLineHold $hold) {}
        };
        $missing = new readonly class(InstallLineHold::NoRelease)
        {
            public function __construct(public InstallLineHold $hold) {}
        };

        $this->assertFalse(Reflector::propertiesMatch($off, $missing));
        $this->assertTrue(Reflector::propertiesMatch($off, clone $off));
    }

    private function policy(string $driver, string $origin): object
    {
        return new readonly class($driver, $origin)
        {
            public function __construct(public string $driver, public string $origin) {}
        };
    }

    private function draft(string $label, string $model, object $policy): object
    {
        return new readonly class($label, $model, $policy)
        {
            public function __construct(public string $label, public string $model, public object $policy) {}
        };
    }

    private function saved(string $label, string $model, object $policy, int $revision): object
    {
        return new readonly class($label, $model, $policy, $revision)
        {
            public function __construct(
                public string $label,
                public string $model,
                public object $policy,
                public int $revision,
            ) {}
        };
    }
}
