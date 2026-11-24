<?php

declare(strict_types=1);

/**
 * Checks that every agent state lays out its methods as the state machine reads them (user messages 19769, 19907 to
 * 19914): first the constructor, its static reference makers and the state's own answers (isFinished, instruction,
 * workPermission, workRecordType) under no marker; then the marked sections Lifecycle (onEnter, onExit, onResume),
 * Hooks (the hook methods in the order the contract declares them, and a tick), Events (the methods that hear a fact)
 * and Internals (private and protected helpers), in that order.
 *
 *   php tools/refactoring/state-sections.php app domain
 *       prints "file:line<TAB>what is wrong" and fails while there is one.
 */

use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require dirname(__DIR__, 2).'/vendor/autoload.php';
require __DIR__.'/models.php';
require __DIR__.'/sections.php';

const STATE_SECTIONS = ['Lifecycle', 'Hooks', 'Events', 'Internals'];

const LIFECYCLE_METHODS = ['onEnter', 'onExit', 'onResume'];

const TICK_METHOD = 'onTick';

/**
 * The hook methods in the order the contract declares them.
 *
 * @return list<string>
 */
function hookMethods(): array
{
    return array_map(
        fn (ReflectedMethod $method) => $method->name(),
        Reflector::of(HookAnswerer::class)->methods(),
    );
}

/**
 * The section a state's method belongs in; none for what stands above the first marker.
 */
function stateSectionOf(ClassMethod $method): string|null
{
    $name = $method->name->toString();

    return match (true) {
        ! $method->isPublic() => 'Internals',
        $method->isStatic(), $name === '__construct' => null,
        in_array($name, LIFECYCLE_METHODS, true) => 'Lifecycle',
        in_array($name, hookMethods(), true), $name === TICK_METHOD => 'Hooks',
        str_starts_with($name, 'on') && $method->getParams() !== [] => 'Events',
        default => null,
    };
}

/**
 * The faults of a state's layout as "line<TAB>fault".
 *
 * @return list<string>
 */
function stateFaultsOf(string $source, Class_ $class): array
{
    $hooks = hookMethods();
    $lastHook = -1;

    return sectionFaults(
        $source,
        $class,
        STATE_SECTIONS,
        function (ClassMethod $method, string|null $section) use ($hooks, &$lastHook): string|null {
            $name = $method->name->toString();
            $wanted = stateSectionOf($method);

            if ($wanted !== $section) {
                return $wanted === null
                    ? "method {$name} belongs above the first section, not in {$section}"
                    : "method {$name} belongs in {$wanted}, not in ".($section ?? 'no section');
            }

            $place = array_search($name, $hooks, true);

            if ($place === false) {
                return null;
            }

            if ($place < $lastHook) {
                return "hook {$name} comes after {$hooks[$lastHook]}, against the order the contract declares";
            }

            $lastHook = $place;

            return null;
        },
    );
}

$parser = new ParserFactory()->createForNewestSupportedVersion();
$faultCount = 0;

foreach (array_slice($argv, 1) as $path) {
    foreach (phpFiles($path) as $file) {
        $source = (string) file_get_contents($file);
        $states = array_filter(
            new NodeFinder()->findInstanceOf($parser->parse($source) ?? [], Class_::class),
            fn (Class_ $class) => $class->extends?->getLast() === 'AgentState',
        );

        foreach ($states as $class) {
            foreach (stateFaultsOf($source, $class) as $fault) {
                $faultCount++;
                echo "{$file}:{$fault}\n";
            }
        }
    }
}

exit($faultCount === 0 ? 0 : 1);
