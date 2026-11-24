<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Attributes\Authorize;
use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Attributes\RequiresRequestKey;
use App\Commands\Desks\ProvisionActorDesk\ProvisionActorDeskCommand;
use App\Support\CommandRegistry;
use App\Support\Reflector;
use App\Support\RegisteredMiddleware;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\TypesDeclared;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;
use Throwable;

/**
 * Commands, handlers and command middleware sit where the bus finds them: every class in a
 * Commands folder is a registered command, the command attributes sit only on registered commands, no handler or
 * middleware keeps static state, and every registered handler and middleware can be built.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class CommandFolderTest extends TestCase
{
    use InstallsCommandModules;
    use RefreshHookDatabase;

    private const string UNLISTED = 'These classes sit in a Commands folder but no owner lists them in commands().';

    private const string MISPLACED = 'Command attributes on a class no owner lists as a command do nothing.';

    private const string STATIC_STATE = 'A handler or middleware is built for each command '
        .'and keeps nothing between requests.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandRegistry();
    }

    public function test_every_class_in_a_commands_folder_is_a_registered_command(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $unlisted = array_filter(
            $this->classesIn('Commands'),
            fn (string $class) => str_ends_with($class, 'Command') && ! $registry->has($class),
        );

        $this->assertContains(ProvisionActorDeskCommand::class, $this->classesIn('Commands'));

        $this->assertSame(
            [],
            array_values($unlisted),
            self::UNLISTED,
        );
    }

    public function test_the_command_attributes_sit_only_on_registered_commands(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $misplaced = [];

        foreach ($this->allClasses() as $class) {
            $declaration = Reflector::of($class);

            foreach ([
                RepeatableRead::class,
                Authorize::class,
                Entry::class,
                RequiresRequestKey::class,
            ] as $attribute) {
                if ($declaration->hasAttribute($attribute) && ! $registry->has($class)) {
                    $misplaced[] = "{$class} carries ".class_basename($attribute);
                }
            }
        }

        $this->assertSame([], $misplaced, self::MISPLACED);
    }

    public function test_no_handler_or_command_middleware_keeps_static_state(): void
    {
        $static = [];

        foreach ([...array_values($this->app->make(CommandRegistry::class)->handlerMap()), ...$this->classesIn('CommandMiddleware')] as $class) {
            foreach (Reflector::of($class)->properties() as $property) {
                if ($property->isStatic()) {
                    $static[] = "{$class}::\${$property->name()}";
                }
            }
        }

        $this->assertSame(
            [],
            $static,
            self::STATIC_STATE,
        );
    }

    public function test_every_registered_handler_and_middleware_can_be_built(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $classes = array_values($registry->handlerMap());
        $unbuildable = [];

        foreach (array_keys($registry->handlerMap()) as $command) {
            array_push(
                $classes,
                ...array_map(
                    fn (RegisteredMiddleware $entry) => $entry->declaration->middleware,
                    $registry->middlewareFor($command),
                ),
            );
        }

        foreach (array_unique($classes) as $class) {
            try {
                $this->app->make($class);
            } catch (Throwable $failure) {
                $unbuildable[] = "{$class}: {$failure->getMessage()}";
            }
        }

        $this->assertSame([], $unbuildable);
    }

    /**
     * Every class declared in a folder of that name in the application or an installed test module.
     *
     * @return list<class-string>
     */
    private function classesIn(string $folder): array
    {
        return array_values(
            // A Console\\Commands folder holds Artisan adapters, never bus pairs.
            array_filter(
                $this->allClasses(),
                fn (string $class) => str_contains($class, "\\{$folder}\\") && ! str_contains($class, '\\Console\\Commands\\'),
            ),
        );
    }

    /**
     * @return list<class-string>
     */
    private function allClasses(): array
    {
        $classes = [];

        foreach (ScanCache::findings(
            new TypesDeclared(),
            DomainFiles::in([app_path(), base_path('tests/Fixtures/Modules')]),
        ) as $declaration) {
            $name = $declaration['name'];

            if (Reflector::exists($name) && Reflector::of($name)->not()->isTrait()) {
                $classes[] = $name;
            }
        }

        return $classes;
    }
}
