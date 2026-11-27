<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Models\Agents\AgentSession;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillRevision;
use App\Skills\Commands\CreateSkill\CreateSkillCommand;
use App\Skills\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Skills\Values\SkillDraft;
use App\Values\SkillKey;
use PHPUnit\Framework\Assert;

/**
 * The journal's skills as a test needs them: made through the skill command and built into a generation through the
 * refresh command.
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
     * Builds the skills afresh into one generation, as skill:refresh does.
     */
    public function refreshSkills(): self
    {
        $this->app->forgetScopedInstances();
        $this->throughEntry(new RefreshSkillsCommand());

        return $this;
    }

    /**
     * The session row, read again, holds this generation id and exactly these skill keys.
     *
     * @param  list<string>  $keys
     */
    public function assertSkillsHanded(AgentSession $session, SkillGeneration $generation, array $keys): self
    {
        $stored = AgentSession::findById($session->id);

        Assert::assertSame($generation->id, $stored->skill_generation_id, "{$session->id} holds another generation.");
        Assert::assertSame($keys, $stored->skill_keys, "{$session->id} was handed other skills.");

        return $this;
    }
}
