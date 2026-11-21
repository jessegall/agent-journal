<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Enums\PublicationState;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Values\PublicationIntent;
use App\Skills\Values\PublicationManifest;

/**
 * Keeps one open intent per session target: a new intent supersedes the open one it replaces, and a delivery
 * supersedes the target's older delivered publications. Each publication changes only its own row.
 */
final readonly class SkillPublications
{
    /**
     * Records the intent to deliver this selection to the session's target.
     *
     * @param  list<string>  $keys  the keys of the selected skills, in the generation's order
     */
    public function intend(
        string $sessionId,
        string $driver,
        string $target,
        SkillGeneration $generation,
        string $selectionDigest,
        array $keys,
    ): SkillPublication {
        return $this->intendMany($generation, [
            new PublicationIntent($sessionId, $driver, $target, $selectionDigest, $keys),
        ])[0];
    }

    /**
     * Records each intent, reading the open and delivered publications of all their targets in two queries.
     *
     * @param  list<PublicationIntent>  $intents
     * @return list<SkillPublication>
     */
    public function intendMany(SkillGeneration $generation, array $intents): array
    {
        $openKeys = array_map(
            fn (PublicationIntent $intent) => SkillPublication::openKeyOf($intent->sessionId, $intent->target),
            $intents,
        );

        $limit = max(1, count($intents));

        $open = SkillPublication::query()
            ->whereIn('open_key', $openKeys)
            ->lockForUpdate()
            ->readExactly($limit)
            ->get()
            ->keyBy('open_key');

        $delivered = SkillPublication::query()
            ->whereIn('session_id', array_map(fn (PublicationIntent $intent) => $intent->sessionId, $intents))
            ->inState(PublicationState::Delivered)
            ->orderByDesc('created_at')
            ->readExactly($limit)
            ->get()
            ->unique(fn (SkillPublication $publication) => $publication->targetKey())
            ->keyBy(fn (SkillPublication $publication) => $publication->targetKey());

        return array_map(function (PublicationIntent $intent) use ($generation, $open, $delivered): SkillPublication {
            $openKey = SkillPublication::openKeyOf($intent->sessionId, $intent->target);
            $open->get($openKey)?->supersede();

            return SkillPublication::create($generation, $intent, $delivered->get($openKey)?->generation_id);
        }, $intents);
    }

    /**
     * Delivers the publication and supersedes the target's older delivered ones.
     */
    public function deliver(SkillPublication $publication, int $fence, PublicationManifest $manifest): void
    {
        $publication->deliver($fence, $manifest);

        SkillPublication::query()
            ->forTarget($publication->session_id, $publication->target)
            ->inState(PublicationState::Delivered)
            ->whereKeyNot($publication->id)
            ->readAll('a target keeps a handful of delivered publications')
            ->get()
            ->each(fn (SkillPublication $older) => $older->supersede());
    }
}
