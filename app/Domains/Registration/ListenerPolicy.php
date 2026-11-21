<?php

declare(strict_types=1);

namespace App\Domains\Registration;

use App\Domains\Pipes\CheckListenerPairs;
use App\Domains\Pipes\ExpandUiUpdaterListeners;
use App\Domains\Pipes\GateListenersByDomain;
use App\Domains\Pipes\SeparateRequiredListeners;
use App\Domains\Support\GatedListeners;
use App\Domains\Support\ListenerDeclarations;
use App\Domains\Support\ListenerOwnership;
use App\Pipelines\Contracts\PipelineRunner;

/**
 * Runs the steps for discovering, checking and registering event listeners: the dispatcher's ordinary ones and the
 * required ones the command's transaction runs, from the same source on discovery and on a cached map.
 */
final readonly class ListenerPolicy
{
    public function __construct(private PipelineRunner $runner, private ListenerOwnership $ownership) {}

    /**
     * The checked pairs for the event cache, required ones included, so both lanes are built from it again.
     *
     * @param  array<string, list<string>>  $events
     * @return array<string, list<string>>
     */
    public function discover(array $events): array
    {
        $declarations = $this->runner->runSteps(
            [ExpandUiUpdaterListeners::class, CheckListenerPairs::class, SeparateRequiredListeners::class],
            new ListenerDeclarations($events, $this->ownership),
            ListenerDeclarations::class,
        );

        return array_merge_recursive($declarations->events, $declarations->required);
    }

    /**
     * @param  array<string, list<string>>  $events
     */
    public function registerCached(array $events): GatedListeners
    {
        return $this->runner->runSteps(
            [CheckListenerPairs::class, SeparateRequiredListeners::class, GateListenersByDomain::class],
            new ListenerDeclarations($events, $this->ownership),
            GatedListeners::class,
        );
    }

    /**
     * @param  array<string, list<string>>  $events
     */
    public function registerDiscovered(array $events): GatedListeners
    {
        return $this->runner->runSteps(
            [SeparateRequiredListeners::class, GateListenersByDomain::class],
            new ListenerDeclarations($events, $this->ownership),
            GatedListeners::class,
        );
    }
}
