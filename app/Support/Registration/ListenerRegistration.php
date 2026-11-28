<?php

declare(strict_types=1);

namespace App\Support\Registration;

use App\Bus\Contracts\PipelineRunner;
use App\Bus\ListenerDeclarations;
use App\Bus\ListenerOwnership;
use App\Bus\ListenerRegistry;
use App\Pipes\CheckListenerPairs;
use App\Pipes\ExpandGroupListeners;
use App\Pipes\GateListenersByDomain;
use App\Pipes\SeparateTransactionListeners;

/**
 * Runs the steps for discovering, checking and registering event listeners: the dispatcher's ordinary ones and the
 * transaction listeners the command's transaction runs, from the same source on discovery and on a cached map.
 */
final readonly class ListenerRegistration
{
    public function __construct(private PipelineRunner $runner, private ListenerOwnership $ownership) {}

    /**
     * The checked pairs for the event cache, transaction listeners included, so both lanes are built from it again.
     *
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string>>
     */
    public function discover(array $events): array
    {
        $declarations = $this->runner->runSteps(
            [ExpandGroupListeners::class, CheckListenerPairs::class, SeparateTransactionListeners::class],
            new ListenerDeclarations($events, $this->ownership),
            ListenerDeclarations::class,
        );

        return array_merge_recursive($declarations->events, $declarations->inCommandTransaction);
    }

    /**
     * @param  array<string, list<string>>  $events
     */
    public function registerCached(array $events): ListenerRegistry
    {
        return $this->runner->runSteps(
            [CheckListenerPairs::class, SeparateTransactionListeners::class, GateListenersByDomain::class],
            new ListenerDeclarations($events, $this->ownership),
            ListenerRegistry::class,
        );
    }

    /**
     * @param  array<string, list<string>>  $events
     */
    public function registerDiscovered(array $events): ListenerRegistry
    {
        return $this->runner->runSteps(
            [SeparateTransactionListeners::class, GateListenersByDomain::class],
            new ListenerDeclarations($events, $this->ownership),
            ListenerRegistry::class,
        );
    }
}
