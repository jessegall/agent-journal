<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\AgentInspection;
use App\Exceptions\SkillSessionHidden;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillReadEntry;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\SkillSelection;
use App\Skills\Values\HandedSkillsReport;
use App\Skills\Values\SkillEntry;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\Support\ReadSkillStateReference;
use App\Support\Inspection\Contracts\StackInspectionQuery;
use App\Values\SessionSkillStatus;
use App\Values\SkillStatus;

/**
 * Reads what skills the acting actor's sessions were handed: a user sees every session, an agent only its own.
 */
final readonly class SkillStatusResolver
{
    private const int MOST_SESSIONS = 200;

    private const int MOST_READS = 200;

    public function __construct(
        private CurrentActor $actors,
        private AgentInspection $inspection,
        private SkillResolver $skills,
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private StackInspectionQuery $stacks,
    ) {}

    /**
     * Every catalogue skill as one visible session has it, evaluated afresh on each call.
     *
     * @return list<SessionSkillStatus>
     *
     * @throws SkillSessionHidden for a session the actor may not see
     */
    public function skillsOfSession(string $sessionId): array
    {
        $session = $this->visibleSession($sessionId);
        $skillEntries = $this->skills->all();
        $selection = $this->selectionOf($session, $skillEntries);

        $handedGeneration = $session->skill_generation_id === null
            ? null
            : SkillGeneration::findById($session->skill_generation_id);

        $latest = SkillGeneration::findLatestReady();
        $lastReads = $this->lastReadsOf($session);
        $waitingKeys = $this->waitingSkillsOf($session);

        return array_map(function (SkillEntry $entry) use (
            $session,
            $selection,
            $handedGeneration,
            $latest,
            $lastReads,
            $waitingKeys,
        ) {
            $key = $entry->key->key;
            $selected = in_array($key, $selection['selected'], true);
            $handedDigest = self::handedDigestOf($session, $handedGeneration, $key);

            $changed = $selected !== ($handedDigest !== null)
                || ($handedDigest !== null && $handedDigest !== $entry->rendered->digest);

            return new SessionSkillStatus(
                $key,
                $entry->revision,
                $latest?->entry($key)?->digest,
                $selected,
                $selected ? 'selected' : $selection['reasons'][$key] ?? 'not-selected',
                $handedDigest === null ? null : $session->skill_generation_id,
                $changed,
                $lastReads[$key] ?? null,
                in_array($key, $waitingKeys, true),
            );
        }, $skillEntries);
    }

    /**
     * The digest of the skill as the session was handed it; none for a skill it was not handed.
     */
    private static function handedDigestOf(
        AgentSession $session,
        SkillGeneration|null $generation,
        string $key,
    ): string|null {
        if (! $session->hasSkill($key)) {
            return null;
        }

        return $generation?->entry($key)?->digest;
    }

    /**
     * The skills the reading state of the session's stack still waits for, as its frame saves them.
     *
     * @return list<string>
     */
    private function waitingSkillsOf(AgentSession $session): array
    {
        $typeKey = StateReferenceKeys::of(ReadSkillStateReference::class);
        $waiting = [];

        foreach ($this->stacks->forTarget($session->target)->frames as $frame) {
            if ($frame->typeKey === $typeKey) {
                $waiting = [...$waiting, ...$frame->textList('skillKeys')];
            }
        }

        return $waiting;
    }

    /**
     * The session's newest read of each skill, by key.
     *
     * @return array<string, SkillReadEntry>
     */
    private function lastReadsOf(AgentSession $session): array
    {
        $lastReads = [];

        foreach (SkillReadEntry::findLatestOfSession($session->id, self::MOST_READS) as $read) {
            $lastReads[$read->skill_key] ??= $read;
        }

        return $lastReads;
    }

    /**
     * The keys selected now, and the reason each other skill is not; a required-skill conflict selects none.
     *
     * @param  list<SkillEntry>  $entries
     * @return array{selected: list<string>, reasons: array<string, string>}
     */
    private function selectionOf(AgentSession $session, array $entries): array
    {
        try {
            $selected = $this->selection->select($entries, $this->contexts->forSession($session));
        } catch (SkillSelectionConflict|SkillContextUnavailable $refused) {
            return [
                'selected' => [],
                'reasons' => array_fill_keys(
                    array_map(fn (SkillEntry $entry) => $entry->key->key, $entries),
                    $refused->getMessage(),
                ),
            ];
        }

        $reasons = [];

        foreach ($selected->excluded as $excluded) {
            $reasons[$excluded->key->key] = $excluded->reason;
        }

        return [
            'selected' => $selected->selectedKeys(),
            'reasons' => $reasons,
        ];
    }

    public function status(): SkillStatus
    {
        return $this->statusOf($this->visibleSessions());
    }

    /**
     * The status of one session the actor may see.
     *
     * @throws SkillSessionHidden for a session the actor may not see, naming nothing
     */
    public function statusOfSession(string $sessionId): SkillStatus
    {
        return $this->statusOf([$this->visibleSession($sessionId)]);
    }

    /**
     * @throws SkillSessionHidden for a session the actor may not see
     */
    private function visibleSession(string $sessionId): AgentSession
    {
        foreach ($this->visibleSessions() as $session) {
            if ($session->id === $sessionId) {
                return $session;
            }
        }

        throw SkillSessionHidden::create();
    }

    /**
     * @param  list<AgentSession>  $sessions
     */
    private function statusOf(array $sessions): SkillStatus
    {
        return new SkillStatus(
            SkillGeneration::findLatest()?->report,
            array_map(fn (AgentSession $session) => HandedSkillsReport::of($session), $sessions),
        );
    }

    /**
     * @return list<AgentSession>
     */
    private function visibleSessions(): array
    {
        if ($this->inspection->seesEveryAgent()) {
            return AgentSession::findNewestSessions(self::MOST_SESSIONS);
        }

        return AgentSession::findNewestSessionsOfAgent($this->actors->actor()->actorId(), self::MOST_SESSIONS);
    }
}
