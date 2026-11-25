<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Attributes\States\StateType;
use App\Support\ReflectedProperty;
use App\Support\ReflectedType;
use App\Support\Stack\StateTypes;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\StateLoading\StateValues;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * Adding a state is writing one class: the class names its own type, the one builder makes it from its
 * saved values, and no factory or loader is written for it.
 */
final class StateLoadingTest extends TestCase
{
    /** The one class that makes frames from references, and the contract it fills. */
    private const array FRAME_MAKERS = ['RegisteredStateFactory.php', 'StateFactory.php'];

    public function test_every_registered_state_of_the_application_names_its_own_type(): void
    {
        $unnamed = [];

        foreach ($this->applicationTypes() as $type) {
            $declared = ReflectedType::of($type->stateClass)->attributes(StateType::class)->first();

            if ($declared->isEmpty() || $declared->get()->key !== $type->key) {
                $unnamed[] = "{$type->key}: {$type->stateClass}";
            }
        }

        $this->assertSame([], $unnamed);
    }

    public function test_every_property_of_a_registered_state_is_saved_data_or_a_collaborator_class(): void
    {
        $untyped = [];

        foreach ($this->applicationTypes() as $type) {
            foreach (ReflectedType::of($type->stateClass)->properties() as $property) {
                if (! $property->isStatic() && ! self::isSavedOrInjected($property)) {
                    $untyped[] = "{$type->stateClass}::\${$property->name()}";
                }
            }
        }

        $this->assertSame([], $untyped);
    }

    public function test_no_state_factory_or_state_loader_class_is_written(): void
    {
        $makers = [];

        foreach (['app', 'domain'] as $root) {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(base_path($root)));

            /** @var SplFileInfo $file */
            foreach ($files as $file) {
                $name = $file->getFilename();
                $isMaker = preg_match('/State(Factory|Loader)\.php$/', $name) === 1;

                if ($isMaker && ! in_array($name, self::FRAME_MAKERS, true)) {
                    $makers[] = $file->getPathname();
                }
            }
        }

        $this->assertSame([], $makers);
    }

    /**
     * Whether the property holds data a frame saves, or a collaborator the container gives by its class.
     */
    private static function isSavedOrInjected(ReflectedProperty $property): bool
    {
        if ($property->type()->isEmpty()) {
            return false;
        }

        $type = $property->type()->get();

        return StateValues::isData($type) || ($type->isNamed() && ! $type->isBuiltin() && ! $type->allowsNull);
    }

    /**
     * The registered types whose state is a class of the application or a domain, not a test fixture.
     *
     * @return list<RegisteredStateType>
     */
    private function applicationTypes(): array
    {
        return array_values(array_filter(
            $this->app->make(StateTypes::class)->registry()->types(),
            fn (RegisteredStateType $type) => ! str_starts_with($type->stateClass, 'Tests\\'),
        ));
    }
}
