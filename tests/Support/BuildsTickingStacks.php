<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Engine\Enums\NoSubject;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Sessions\AgentSessions;
use App\Sessions\States\Support\ReadyStateReference;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Stacks\StateTypes;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestSelections;

/**
 * Stacks of running sessions written straight to the database, with a bottom frame, a frame of a type that does not
 * tick, and frames of a ticking type named after a prefix.
 */
trait BuildsTickingStacks
{
    /**
     * @param  list<string>  $subjects  one ticking frame per subject, its frame id the subject itself, saved as the
     *                                  ticking state's value of the name given
     */
    private function tickingStack(
        string $tickingType,
        array $subjects,
        CarbonImmutable $enteredAt,
        string $plainType = 'test.plain',
        string $subjectValue = 'subject',
    ): AgentStackRow {
        $agent = Agent::create('Ticking agent', 'main-agent', $this->localProject());
        $session = $this->app->make(AgentSessions::class)->start(
            $agent,
            TestSelections::of(),
            TestSelections::requestId(),
        );
        $ready = ReadyStateReference::forSession(new StackTarget($agent->id, $session->id));
        $records = [
            // The ready state is built from its agent and session, as a session's opening writes them.
            new FrameRecord(
                "{$session->id}-ready",
                $ready,
                true,
                1,
                $enteredAt,
                $ready->values,
            ),
            new FrameRecord(
                "{$session->id}-plain",
                new StateReference($plainType, NoSubject::None),
                false,
                1,
                $enteredAt,
            ),
        ];

        foreach ($subjects as $subject) {
            $records[] = new FrameRecord(
                $subject,
                new StateReference($tickingType, new SubjectReference($subject, 1)),
                false,
                1,
                $enteredAt,
                [$subjectValue => $subject],
            );
        }

        $row = new AgentStackRow();
        $row->startFor(
            new StackTarget($agent->id, $session->id),
            new FrameRecords($records),
            $this->app->make(StateTypes::class)->ticking(),
        );

        return $row;
    }
}
