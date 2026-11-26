<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Models\Agents\AgentSession;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillPublication;
use App\Models\Skills\SkillRevision;
use App\Skills\Commands\CreateSkill\CreateSkillCommand;
use App\Skills\Enums\PublicationStatus;
use App\Skills\SkillPublishingService;
use App\Skills\Values\SkillDraft;
use App\Values\SkillKey;
use PHPUnit\Framework\Assert;

/**
 * The journal's skills as a test needs them: made through the skill command and delivered by the journal's own
 * publisher to the skill targets the test bound, a folder of its own.
 */
trait ArrangesSkills
{
    /**
     * The actor in place makes the skill under this key at its first revision.
     */
    public function skill(string $key, SkillDraft $draft): self
    {
        $this->run(new CreateSkillCommand($key, "create-{$key}", $draft));

        return $this;
    }

    public function skillRevisionOf(string $key): SkillRevision
    {
        return SkillRevision::findCurrentOf(
            Skill::query()->withoutGlobalScopes()->withKey(SkillKey::from($key))->sole(),
        );
    }

    /**
     * Builds the skills afresh and delivers every open publication, as the journal's publisher does on its run.
     */
    public function publishSkills(): self
    {
        $publisher = $this->app->make(SkillPublishingService::class);
        $publisher->refresh();
        $publisher->publishOpen('test publisher');

        return $this;
    }

    /**
     * The newest publication of the skills to the session's target.
     */
    private function publicationOf(AgentSession $session): SkillPublication
    {
        return SkillPublication::query()
            ->withoutGlobalScopes()
            ->where('session_id', $session->id)
            ->latest('created_at')
            ->firstOrFail();
    }

    public function assertSkillPublished(string $key, AgentSession $session): self
    {
        $publication = $this->publicationOf($session);

        Assert::assertSame(
            PublicationStatus::Delivered,
            $publication->status,
            "The skills of {$session->id} were not delivered.",
        );
        Assert::assertContains(
            $key,
            $publication->skill_keys,
            "The publication of {$session->id} does not hold {$key}.",
        );

        return $this;
    }
}
