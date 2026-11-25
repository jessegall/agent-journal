<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Skills\PublicationStatus;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Values\PublicationIntent;
use App\Values\PublicationManifest;

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
            fn (PublicationIntent $intent) => SkillPublication::resolveOpenKeyOf($intent->sessionId, $intent->target),
            $intents,
        );

        $limit = max(1, count($intents));

        $open = SkillPublication::query()
            ->withAnyOpenKey($openKeys)
            ->lockForUpdate()
            ->readExactly($limit)
            ->get()
            ->keyBy('open_key');

        $delivered = SkillPublication::query()
            ->ofSessions(array_map(fn (PublicationIntent $intent) => $intent->sessionId, $intents))
            ->inState(PublicationStatus::Delivered)
            ->newestCreatedFirst()
            ->readExactly($limit)
            ->get()
            ->unique(fn (SkillPublication $publication) => $publication->target_key)
            ->keyBy(fn (SkillPublication $publication) => $publication->target_key);

        return array_map(function (PublicationIntent $intent) use ($generation, $open, $delivered): SkillPublication {
            $openKey = SkillPublication::resolveOpenKeyOf($intent->sessionId, $intent->target);
            $openPublication = $open->get($openKey);
            $openPublication?->supersede();
            $deliveredPublication = $delivered->get($openKey);

            return SkillPublication::create($generation, $intent, $deliveredPublication?->generation_id);
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
            ->inState(PublicationStatus::Delivered)
            ->whereKeyNot($publication->id)
            ->readAll('a target keeps a handful of delivered publications')
            ->get()
            ->each(fn (SkillPublication $older) => $older->supersede());
    }
}
