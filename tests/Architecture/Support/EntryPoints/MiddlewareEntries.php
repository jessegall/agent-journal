<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Support\CommandFrame;
use App\Support\CommandRegistry;
use App\Support\Reflector;
use App\Support\RegisteredMiddleware;

/**
 * Every middleware a command passes: the frame's own, read from CommandFrame, and each module middleware the booted
 * registry hands any command, each with its one test file under the middleware folder of core or of its domain.
 */
final readonly class MiddlewareEntries
{
    public function __construct(private CommandRegistry $registry) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        $classes = [...CommandFrame::FIRST, CommandFrame::TRANSACTION, ...CommandFrame::INSIDE];

        foreach (array_keys($this->registry->handlerMap()) as $command) {
            $classes = [...$classes, ...array_map(
                fn (RegisteredMiddleware $middleware) => $middleware->middlewareClass(),
                $this->registry->middlewareFor($command),
            )];
        }

        return array_map(function (string $class): EntryPoint {
            $file = Reflector::of($class)->shortName().'Test.php';

            return new EntryPoint(
                EntryType::Middleware,
                $class,
                EntryPoint::folderOf($class, EntryType::Middleware)."/{$file}",
            );
        }, array_values(array_unique($classes)));
    }
}
