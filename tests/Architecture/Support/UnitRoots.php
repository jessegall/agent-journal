<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Bus\CommandTransaction;
use App\Contracts\Bus\PipelineDefinition;
use App\Contracts\Sessions\StartTransaction;
use App\Contracts\Work\StackTransaction;
use App\Contracts\Work\StackTransactionRunner;
use App\Contracts\Work\UnitOfWork;
use App\Support\CommandFrame;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Reflector;
use App\Support\StackTransaction as StackTransactionOwner;
use App\Support\States\AgentState;
use Illuminate\Contracts\Container\Container;
use Tests\Support\CodeReferenceScan;
use Tests\Support\ScanCache\ScanCache;

/**
 * The classes whose work runs inside an event unit outside a handler: the bus steps inside the command's
 * transaction, each transaction listener, each state and
 * hook input, each class that runs work through a transaction owner (the stack transaction, a start transaction, the
 * unit of work), the pipes of every pipeline such a class names, and the listeners of a request event sent only from
 * inside a unit. The command reach follows each of them like a handler.
 */
final readonly class UnitRoots
{
    /**
     * The namespace of the objects a profile script calls, which run only inside a profile run's unit.
     */
    private const string SCRIPT_OBJECTS = 'App\\Support\\Objects\\';

    /**
     * The transaction owners whose work closures run inside an event unit, and the command transaction a class
     * asserts it runs in.
     */
    private const array UNIT_OWNERS = [
        CommandTransaction::class,
        StackTransactionOwner::class,
        StackTransaction::class,
        StackTransactionRunner::class,
        StartTransaction::class,
        UnitOfWork::class,
    ];

    /**
     * @param  list<string>  $folders
     * @param  class-string  $transactionListenerAttribute
     * @return list<string>
     */
    public static function in(array $folders, string $transactionListenerAttribute, Container $container): array
    {
        $roots = [];

        foreach (ScanCache::findingsByFile(new CodeReferenceScan(), DomainFiles::in($folders)) as $findings) {
            $declared = self::valuesOf($findings, CodeReferenceScan::DECLARES);
            $named = self::valuesOf($findings, CodeReferenceScan::NAMES);
            $ownsUnit = array_intersect($named, self::UNIT_OWNERS) !== [];

            foreach ($declared as $class) {
                if ($ownsUnit || self::runsInUnit($class, $transactionListenerAttribute)) {
                    $roots[] = $class;
                }
            }

            if ($ownsUnit) {
                array_push($roots, ...self::pipesNamedBy($named, $container));
            }
        }

        return array_values(array_unique([...$roots, ...CommandFrame::INSIDE]));
    }

    /**
     * The listeners of every request event whose senders all run inside a unit: a request event is answered at once
     * where it is sent, so its listeners run in the sender's unit.
     *
     * @param  list<string>  $folders
     * @param  array<string, list<string>>  $reachedFiles  the files a unit holds, relative to the project root
     * @return list<string>
     */
    public static function requestListenersIn(array $folders, array $reachedFiles, string $projectRoot): array
    {
        $heldRequests = [];

        foreach (EventProducers::expected($projectRoot) as $event => $expectation) {
            $producers = $expectation['producers'];

            if ($expectation['role'] === EventRole::Request && $producers !== []
                && array_diff($producers, array_keys($reachedFiles)) === []) {
                $heldRequests[] = $event;
            }
        }

        $listeners = [];

        foreach (ScanCache::findingsByFile(new CodeReferenceScan(), DomainFiles::in($folders)) as $findings) {
            if (array_intersect(self::valuesOf($findings, CodeReferenceScan::SERVES), $heldRequests) !== []) {
                array_push($listeners, ...self::valuesOf($findings, CodeReferenceScan::DECLARES));
            }
        }

        return array_values(array_unique($listeners));
    }

    /**
     * @param  list<string>  $findings
     * @return list<string>
     */
    private static function valuesOf(array $findings, string $prefix): array
    {
        return array_values(array_map(
            fn (string $finding) => substr($finding, strlen($prefix)),
            array_filter($findings, fn (string $finding) => str_starts_with($finding, $prefix)),
        ));
    }

    /**
     * Whether the class only ever runs inside a unit: a transaction listener, a script object, or a state or hook
     * input, which run only in a hook walk or a fact delivery, both inside the stack transaction.
     *
     * @param  class-string  $transactionListenerAttribute
     */
    private static function runsInUnit(string $class, string $transactionListenerAttribute): bool
    {
        if (! Reflector::exists($class)) {
            return false;
        }

        $declaration = Reflector::of($class);

        return $declaration->hasAttribute($transactionListenerAttribute)
            || str_starts_with($class, self::SCRIPT_OBJECTS)
            || $declaration->isSubclassOf(AgentState::class)
            || $declaration->implements(HookInput::class);
    }

    /**
     * The pipe classes of every pipeline among the named classes.
     *
     * @param  list<string>  $named
     * @return list<string>
     */
    private static function pipesNamedBy(array $named, Container $container): array
    {
        $pipes = [];

        foreach ($named as $class) {
            if (! Reflector::exists($class) || ! Reflector::of($class)->implements(PipelineDefinition::class)) {
                continue;
            }

            $definition = $container->make($class);

            if ($definition instanceof PipelineDefinition) {
                array_push($pipes, ...array_filter($definition->pipes(), is_string(...)));
            }
        }

        return $pipes;
    }
}
