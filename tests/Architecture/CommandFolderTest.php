<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\RegisteredMiddleware;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\NodeFinder;
use ReflectionClass;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\InstallsCommandModules;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;
use Throwable;

/**
 * Commands, handlers and command middleware sit where the bus finds them (doc 19, section 6.8): every class in a
 * Commands folder is a registered command, the command attributes sit only on registered commands, no handler or
 * middleware keeps static state, and every registered handler and middleware can be built.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class CommandFolderTest extends TestCase
{
    use InstallsCommandModules;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandRegistry();
    }

    public function test_every_class_in_a_commands_folder_is_a_registered_command(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $unlisted = array_filter($this->classesIn('Commands'), fn (string $class) => ! $registry->has($class));

        $this->assertSame([], array_values($unlisted), 'These classes sit in a Commands folder but no owner lists them in commands().');
    }

    public function test_the_command_attributes_sit_only_on_registered_commands(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $misplaced = [];

        foreach ($this->allClasses() as $class) {
            $reflection = new ReflectionClass($class);

            foreach ([HandledBy::class, RepeatableRead::class, RequiresActor::class] as $attribute) {
                if ($reflection->getAttributes($attribute) !== [] && ! $registry->has($class)) {
                    $misplaced[] = "{$class} carries ".class_basename($attribute);
                }
            }
        }

        $this->assertSame([], $misplaced, 'Command attributes on a class no owner lists as a command do nothing.');
    }

    public function test_no_handler_or_command_middleware_keeps_static_state(): void
    {
        $static = [];

        foreach ([...$this->classesIn('Handlers'), ...$this->classesIn('CommandMiddleware')] as $class) {
            foreach ((new ReflectionClass($class))->getProperties() as $property) {
                if ($property->isStatic()) {
                    $static[] = "{$class}::\${$property->getName()}";
                }
            }
        }

        $this->assertSame([], $static, 'A handler or middleware is built for each command and keeps nothing between requests.');
    }

    public function test_every_registered_handler_and_middleware_can_be_built(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $classes = array_values($registry->handlerMap());
        $unbuildable = [];

        foreach (array_keys($registry->handlerMap()) as $command) {
            array_push($classes, ...array_map(fn (RegisteredMiddleware $entry) => $entry->declaration->middleware, $registry->middlewareFor($command)));
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
        return array_values(array_filter($this->allClasses(), fn (string $class) => str_contains($class, "\\{$folder}\\")));
    }

    /**
     * @return list<class-string>
     */
    private function allClasses(): array
    {
        $classes = [];

        foreach (DomainFiles::in([app_path(), base_path('tests/Fixtures/Modules')]) as $file) {
            foreach ((new NodeFinder)->findInstanceOf(ParsedFile::fromPath($file)->statements, ClassLike::class) as $declaration) {
                $name = $declaration->namespacedName?->toString();

                if ($name !== null && (class_exists($name) || interface_exists($name) || enum_exists($name))) {
                    $classes[] = $name;
                }
            }
        }

        return $classes;
    }
}
