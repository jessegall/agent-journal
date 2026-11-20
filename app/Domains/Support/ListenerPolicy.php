<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Domains\Pipes\CheckListenerPairs;
use App\Domains\Pipes\ExpandUiUpdaterListeners;
use App\Domains\Pipes\GateListenersByDomain;
use App\Domains\Values\GatedListeners;
use App\Domains\Values\ListenerDeclarations;
use App\Pipelines\Contracts\PipelineRunner;

/**
 * Runs the steps for discovering, checking and registering ordinary event listeners.
 */
final readonly class ListenerPolicy
{
    public function __construct(private PipelineRunner $runner, private ListenerOwnership $ownership) {}

    /**
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string>>
     */
    public function discover(array $events): array
    {
        return $this->runner->runSteps(
            [ExpandUiUpdaterListeners::class, CheckListenerPairs::class],
            new ListenerDeclarations($events, $this->ownership),
            ListenerDeclarations::class,
        )->events;
    }

    /**
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string|AvailableListener|FailureLoggingListener>>
     */
    public function registerCached(array $events): array
    {
        return $this->runner->runSteps(
            [CheckListenerPairs::class, GateListenersByDomain::class],
            new ListenerDeclarations($events, $this->ownership),
            GatedListeners::class,
        )->events;
    }

    /**
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string|AvailableListener|FailureLoggingListener>>
     */
    public function registerDiscovered(array $events): array
    {
        return $this->runner->runSteps(
            [GateListenersByDomain::class],
            new ListenerDeclarations($events, $this->ownership),
            GatedListeners::class,
        )->events;
    }
}
