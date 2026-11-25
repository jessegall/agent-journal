<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Skills\SkillResolver;
use App\Enums\PublicationState;
use App\Enums\SkillReload;
use App\Exceptions\SkillContextUnavailable;
use App\Exceptions\SkillSelectionConflict;
use App\Exceptions\SkillSessionHidden;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Models\Skills\SkillReceipt;
use App\Support\AgentInspection;
use App\Support\Drivers\DriverSkillAdapters;
use App\Support\SkillSelection;
use App\Values\DriverKey;
use App\Values\SessionSkillStatus;
use App\Values\SkillEntry;
use App\Values\SkillStatus;

/**
 * Reads where skill delivery stands for the acting actor: a user sees every session, an agent only its own, so no
 * agent ever sees another session's target.
 */
final readonly class SkillStatusResolver
{
    private const int MOST_SESSIONS = 200;

    public function __construct(
        private CurrentActor $actors,
        private AgentInspection $inspection,
        private SkillResolver $skills,
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private DriverSkillAdapters $adapters,
    ) {}

    /**
     * Every catalogue skill as one visible session has it, evaluated afresh on each call.
     *
     * @return list<SessionSkillStatus>
     *
     * @throws SkillSessionHidden for a session the actor may not see or that has no publication
     */
    public function skillsOfSession(string $sessionId): array
    {
        $this->visiblePublicationsOf($sessionId);
        $session = AgentSession::byId($sessionId);
        $skillEntries = $this->skills->all();
        $selection = $this->selectionOf($session, $skillEntries);
        $delivered = SkillPublication::latestDeliveredOfSession($sessionId);
        $started = SkillPublication::firstOfSession($sessionId);
        $generation = SkillGeneration::latestReady();
        $driver = DriverKey::from($started->skill_protocol);

        $reloadsAtNewSession = $this->adapters->supports($driver)
            && $this->adapters->for($driver)->reloadMode() === SkillReload::NewSession;

        return array_map(function (SkillEntry $entry) use (
            $sessionId,
            $selection,
            $delivered,
            $started,
            $generation,
            $reloadsAtNewSession,
        ) {
            $key = $entry->key->key;
            $selected = in_array($key, $selection['selected'], true);

            $deliveredEntry = $delivered !== null && in_array($key, $delivered->skill_keys, true)
                ? $delivered->generation()->entry($key)
                : null;

            $startedEntry = in_array($key, $started->skill_keys, true) ? $started->generation()->entry($key) : null;
            $startedDigest = $startedEntry === null ? null : $startedEntry['digest'];
            $currentDigest = $deliveredEntry === null ? null : $deliveredEntry['digest'];

            return new SessionSkillStatus(
                $key,
                $entry->revision,
                $generation?->entry($key)['digest'] ?? null,
                $selected,
                $selected ? 'selected' : $selection['reasons'][$key] ?? 'not-selected',
                $deliveredEntry === null ? null : $delivered->generation_id,
                $deliveredEntry === null ? 'not-delivered' : PublicationState::Delivered->value,
                $deliveredEntry !== null && SkillReceipt::hasRead($sessionId, $key, $deliveredEntry['digest']),
                $reloadsAtNewSession && $selected && ($startedDigest === null || $startedDigest !== $currentDigest),
            );
        }, $skillEntries);
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
        return $this->statusOf($this->visiblePublications());
    }

    /**
     * The status of one session the actor may see.
     *
     * @throws SkillSessionHidden for a session the actor may not see or that has no publication, naming nothing
     */
    public function statusOfSession(string $sessionId): SkillStatus
    {
        return $this->statusOf($this->visiblePublicationsOf($sessionId));
    }

    /**
     * @return non-empty-list<SkillPublication>
     *
     * @throws SkillSessionHidden for a session the actor may not see or that has no publication
     */
    private function visiblePublicationsOf(string $sessionId): array
    {
        $publications = array_values(array_filter(
            $this->visiblePublications(),
            fn (SkillPublication $publication) => $publication->session_id === $sessionId,
        ));

        if ($publications === []) {
            throw SkillSessionHidden::create();
        }

        return $publications;
    }

    /**
     * @param  list<SkillPublication>  $publications
     */
    private function statusOf(array $publications): SkillStatus
    {
        return new SkillStatus(
            SkillGeneration::latest()?->status,
            array_map(fn (SkillPublication $publication) => $publication->status, $publications),
        );
    }

    /**
     * @return list<SkillPublication>
     */
    private function visiblePublications(): array
    {
        $actor = $this->actors->actor();

        if ($this->inspection->seesEveryAgent()) {
            return SkillPublication::latestOfEverySession(self::MOST_SESSIONS);
        }

        $sessionIds = AgentSession::idsOfAgent($actor->actorId(), self::MOST_SESSIONS);

        return SkillPublication::latestOfSessions($sessionIds, self::MOST_SESSIONS);
    }
}
