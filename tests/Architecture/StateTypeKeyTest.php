<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Stacks\Attributes\StateType;
use App\Support\Reflector;
use Illuminate\Support\Str;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Finder\Finder;

/**
 * A state type key starts with the key of what owns the state: core for a Core state, the domain's own key for a
 * domain's state, so a key never names an area the state no longer lives in.
 */
final class StateTypeKeyTest extends TestCase
{
    private const array FOLDERS = ['app', 'domain', 'tests/Fixtures/Domains'];

    public function test_every_state_type_key_starts_with_its_owner(): void
    {
        $misnamed = [];

        foreach ($this->stateClasses() as $class) {
            $key = Reflector::of($class)->attribute(StateType::class)->key();
            $owner = self::ownerKeyOf($class);

            if (! str_starts_with($key, "{$owner}.")) {
                $misnamed[] = "{$class} declares {$key}; its key starts with {$owner}.";
            }
        }

        $this->assertSame([], $misnamed);
    }

    /**
     * Nothing is released yet, so no stored state of an older shape exists to read: every state type is at schema
     * version 1 until version 6 ships.
     */
    public function test_every_state_type_is_at_schema_version_one(): void
    {
        $later = [];

        foreach ($this->stateClasses() as $class) {
            $version = Reflector::of($class)->attribute(StateType::class)->version;

            if ($version !== 1) {
                $later[] = "{$class} declares schema version {$version}";
            }
        }

        $this->assertSame([], $later);
    }

    /**
     * The key a class's owner gives its state types: core for App, the domain's name in snake case otherwise.
     */
    private static function ownerKeyOf(string $class): string
    {
        if (str_starts_with($class, 'App\\')) {
            return 'core';
        }

        $domain = preg_replace('/^(?:Domain|Tests\\\\Fixtures\\\\Domains)\\\\([^\\\\]+)\\\\.*$/', '$1', $class);

        return Str::snake((string) $domain);
    }

    /**
     * Every class under the folders that declares a state type.
     *
     * @return list<class-string>
     */
    private function stateClasses(): array
    {
        $root = dirname(__DIR__, 2);
        $finder = Finder::create()->files()->name('*.php')->contains('#[StateType(')
            ->in(array_map(fn (string $folder) => "{$root}/{$folder}", self::FOLDERS));
        $classes = [];

        foreach ($finder as $file) {
            $source = $file->getContents();

            if (preg_match('/^namespace ([^;]+);/m', $source, $namespace) !== 1) {
                continue;
            }

            $class = "{$namespace[1]}\\{$file->getFilenameWithoutExtension()}";

            if (Reflector::exists($class) && Reflector::of($class)->hasAttribute(StateType::class)) {
                $classes[] = $class;
            }
        }

        sort($classes);

        return $classes;
    }
}
