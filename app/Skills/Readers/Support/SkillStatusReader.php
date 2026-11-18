<?php

declare(strict_types=1);

namespace App\Skills\Readers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Models\AgentSession;
use App\Programs\Values\ProgramKey;
use App\Skills\Contracts\SkillReader;
use App\Skills\Enums\PublicationState;
use App\Skills\Enums\SkillReload;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Exceptions\SkillSessionHidden;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Models\SkillReceipt;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Support\SkillSelection;
use App\Skills\Values\SessionSkillStatus;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillStatus;
use Illuminate\Contracts\Container\Container;

/**
 * Reads where skill delivery stands for the acting actor: a user sees every session, an agent only its own, so no
 * agent ever sees another session's target.
 */
final readonly class SkillStatusReader
{
    private const int MOST_SESSIONS = 200;

    public function __construct(
        private CurrentActor $actors,
        private Container $container,
        private SkillContextReader $contexts,
        private SkillSelection $selection,
        private ProgramSkillAdapters $adapters,
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
        $entries = $this->container->make(SkillReader::class)->all();
        $selection = $this->selectionOf($session, $entries);
        $delivered = SkillPublication::latestDeliveredOfSession($sessionId);
        $launched = SkillPublication::firstOfSession($sessionId);
        $generation = SkillGeneration::latestReady();
        $reloadsAtNewSession = $this->adapters->supports(ProgramKey::from($launched->program))
            && $this->adapters->for(ProgramKey::from($launched->program))->reloadMode() === SkillReload::NewSession;

        return array_map(function (SkillEntry $entry) use (
            $sessionId,
            $selection,
            $delivered,
            $launched,
            $generation,
            $reloadsAtNewSession,
        ) {
            $key = $entry->key->key;
            $selected = in_array($key, $selection['selected'], true);
            $deliveredEntry = $delivered !== null && in_array($key, $delivered->skill_keys, true)
                ? $delivered->generation()->entry($key)
                : null;
            $launchedEntry = in_array($key, $launched->skill_keys, true) ? $launched->generation()->entry($key) : null;
            $launchedDigest = $launchedEntry === null ? null : $launchedEntry['digest'];
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
                $reloadsAtNewSession && $selected && ($launchedDigest === null || $launchedDigest !== $currentDigest),
            );
        }, $entries);
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
            return ['selected' => [], 'reasons' => array_fill_keys(
                array_map(fn (SkillEntry $entry) => $entry->key->key, $entries),
                $refused->getMessage(),
            )];
        }

        $reasons = [];

        foreach ($selected->excluded as $excluded) {
            $reasons[$excluded->key->key] = $excluded->reason;
        }

        return ['selected' => $selected->selectedKeys(), 'reasons' => $reasons];
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
            SkillGeneration::latest()?->status(),
            array_map(fn (SkillPublication $publication) => $publication->status(), $publications),
        );
    }

    /**
     * @return list<SkillPublication>
     */
    private function visiblePublications(): array
    {
        $actor = $this->actors->actor();

        if ($actor->isUser()) {
            return SkillPublication::latestOfEverySession(self::MOST_SESSIONS);
        }

        $actor->requireAgent();
        $sessionIds = AgentSession::idsOfAgent($actor->actorId(), self::MOST_SESSIONS);

        return SkillPublication::latestOfSessions($sessionIds, self::MOST_SESSIONS);
    }
}
