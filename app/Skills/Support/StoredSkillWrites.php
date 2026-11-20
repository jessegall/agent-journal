<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Events\SkillsChanged;
use App\Skills\Exceptions\SkillRequestReused;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillRequest;
use App\Skills\Models\SkillRevision;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillRevisionResult;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * What every stored skill write shares: the acting user, the replay of a request id it already answered, the check of a
 * draft against the condition tree and the renderer's limits, and the after-commit event.
 */
final readonly class StoredSkillWrites
{
    public const string EVERYONE = '{"type":"everyone","version":1}';

    public function __construct(
        private CurrentActor $actors,
        private ConditionTree $conditions,
        private CanonicalRenderer $renderer,
        private Dispatcher $events,
    ) {}

    public function author(): ActorIdentity
    {
        return ActorIdentity::of($this->actors->actor());
    }

    /**
     * The result of the request id when it was answered before with the same input, or of the write it runs now.
     *
     * @param  Closure(): SkillRevision  $write
     *
     * @throws SkillRequestReused when the id was used for other input
     */
    public function once(string $requestId, string $inputDigest, Closure $write): SkillRevisionResult
    {
        $author = $this->author();
        $earlier = SkillRequest::earlier($author, $requestId);

        if ($earlier !== null) {
            return $earlier->sentWith($inputDigest) ? $this->resultOf(
                SkillRevision::query()->whereKey($earlier->skill_revision_id)->firstOrFail(),
                $requestId,
            ) : throw SkillRequestReused::for($requestId);
        }

        $revision = $write();
        SkillRequest::record($author, $requestId, $inputDigest, $revision);
        $this->events->dispatch(new SkillsChanged($revision->skill_id, $revision->revision));

        return $this->resultOf($revision, $requestId);
    }

    /**
     * The draft's condition, Everyone when it names none, after the draft passed every limit the renderer checks.
     */
    public function checkedCondition(string $key, SkillDraft $draft): SkillCondition
    {
        $condition = $this->conditions->fromJson(trim($draft->condition) === '' ? self::EVERYONE : $draft->condition);
        $this->renderer->render(new DraftSkill($key, $draft, $condition), SkillOwner::stored());

        return $condition;
    }

    private function resultOf(SkillRevision $revision, string $requestId): SkillRevisionResult
    {
        $skill = Skill::query()->whereKey($revision->skill_id)->firstOrFail();

        return new SkillRevisionResult($skill->id, $skill->number, $revision->revision, true, $requestId);
    }
}
