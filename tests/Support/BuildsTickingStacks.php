<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use Carbon\CarbonImmutable;

/**
 * Stacks of running sessions written straight to the database, with a bottom frame, a frame of a type that does not
 * tick, and frames of a ticking type named after a prefix.
 */
trait BuildsTickingStacks
{
    /**
     * @param  list<string>  $subjects  one ticking frame per subject, its frame id the subject itself
     */
    private function tickingStack(string $tickingType, array $subjects, CarbonImmutable $enteredAt, string $plainType = 'test.plain'): AgentStackRow
    {
        $agent = Agent::query()->create(['name' => 'Ticking agent', 'role' => 'hooks.main_ready']);
        $session = new AgentSession();
        $session->startFor($agent, null);
        $records = [
            new FrameRecord("{$session->id}-ready", new StateReference('hooks.main_ready', NoSubject::None), true, 1, $enteredAt),
            new FrameRecord("{$session->id}-plain", new StateReference($plainType, NoSubject::None), false, 1, $enteredAt),
        ];

        foreach ($subjects as $subject) {
            $records[] = new FrameRecord($subject, new StateReference($tickingType, new SubjectReference($subject, 1)), false, 1, $enteredAt);
        }

        $row = new AgentStackRow();
        $row->startFor(new StackTarget($agent->id, $session->id), new FrameRecords($records), $this->app->make(StateTypes::class)->ticking());

        return $row;
    }
}
