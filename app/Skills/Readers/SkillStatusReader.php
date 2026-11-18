<?php

declare(strict_types=1);

namespace App\Skills\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Models\AgentSession;
use App\Skills\Models\SkillGeneration;
use App\Skills\Exceptions\SkillSessionHidden;
use App\Skills\Models\SkillPublication;
use App\Skills\Values\SkillStatus;

/**
 * Reads where skill delivery stands for the acting actor: a user sees every session, an agent only its own, so no
 * agent ever sees another session's target.
 */
final readonly class SkillStatusReader
{
    private const int MOST_SESSIONS = 200;

    public function __construct(
        private CurrentActor $actors,
    ) {}

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
        $publications = array_values(array_filter(
            $this->visiblePublications(),
            fn (SkillPublication $publication) => $publication->session_id === $sessionId,
        ));

        if ($publications === []) {
            throw SkillSessionHidden::create();
        }

        return $this->statusOf($publications);
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
