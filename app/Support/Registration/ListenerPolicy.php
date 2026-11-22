<?php

declare(strict_types=1);

namespace App\Support\Registration;

use App\Contracts\Bus\PipelineRunner;
use App\Pipes\CheckListenerPairs;
use App\Pipes\ExpandUiUpdaterListeners;
use App\Pipes\GateListenersByDomain;
use App\Pipes\SeparateRequiredListeners;
use App\Support\GatedListeners;
use App\Support\ListenerDeclarations;
use App\Support\ListenerOwnership;

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
